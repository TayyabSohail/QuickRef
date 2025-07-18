'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { snippetSchema } from '@/schemas/snippet';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSnippet } from '@/actions/snippet';
import { toast } from 'sonner';

export default function SnippetForm() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof snippetSchema>>({
    resolver: zodResolver(snippetSchema),
  });

  const mutation = useMutation({
    mutationFn: createSnippet,
    onSuccess: () => {
      toast.success('Snippet created');
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      form.reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = (values: z.infer<typeof snippetSchema>) => {
    mutation.mutate(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
      <Input placeholder='Language' {...form.register('language')} />
      <Textarea placeholder='Code...' {...form.register('content')} />
      <Textarea
        placeholder='Description...'
        {...form.register('description')}
      />
      <Button type='submit' disabled={mutation.isPending}>
        Submit
      </Button>
    </form>
  );
}
