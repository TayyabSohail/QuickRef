'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { snippetSchema } from '@/schemas/snippet';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSnippet, deleteSnippet, updateSnippet } from '@/actions/snippet';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';

type Props = {
  snippet: any;
  mode: 'view' | 'edit' | 'add';
  onClose: () => void;
};

export default function SnippetModal({ snippet, mode, onClose }: Props) {
  const { user, isLoading: isUserLoading } = useUser();
  const queryClient = useQueryClient();

  const isOwner = user?.id === snippet?.user_id;

  const form = useForm<z.infer<typeof snippetSchema>>({
    resolver: zodResolver(snippetSchema),
    defaultValues: snippet ?? {
      title: '',
      language: '',
      content: '',
      description: '',
    },
  });

  const create = useMutation({
    mutationFn: createSnippet,
    onSuccess: () => {
      toast.success('Snippet created');
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const update = useMutation({
    mutationFn: (data: any) => updateSnippet(snippet.id, data),
    onSuccess: () => {
      toast.success('Snippet updated');
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: () => deleteSnippet(snippet.id),
    onSuccess: () => {
      toast.success('Snippet deleted');
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      onClose();
    },
  });

  const onSubmit = (values: z.infer<typeof snippetSchema>) => {
    if (mode === 'add') {
      create.mutate(values);
    } else if (mode === 'edit') {
      update.mutate(values);
    }
  };

  const isReadOnly = mode === 'view' || (mode === 'edit' && !isOwner);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add'
              ? 'New Snippet'
              : isReadOnly
                ? 'View Snippet'
                : 'Edit Snippet'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            placeholder='Title'
            {...form.register('title')}
            readOnly={isReadOnly}
          />
          <Input
            placeholder='Language'
            {...form.register('language')}
            readOnly={isReadOnly}
          />
          <Textarea
            placeholder='Code...'
            {...form.register('content')}
            readOnly={isReadOnly}
          />
          <Textarea
            placeholder='Description...'
            {...form.register('description')}
            readOnly={isReadOnly}
          />

          <div className='flex justify-between pt-2'>
            {mode === 'view' && isOwner && (
              <Button type='button' onClick={onClose} variant='outline'>
                Close
              </Button>
            )}

            {mode === 'edit' && isOwner && (
              <>
                <Button type='submit' disabled={update.isPending}>
                  {update.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant='destructive'
                  onClick={() => remove.mutate()}
                  disabled={remove.isPending}
                >
                  Delete
                </Button>
              </>
            )}

            {mode === 'add' && (
              <Button type='submit' disabled={create.isPending}>
                {create.isPending ? 'Adding...' : 'Add'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
