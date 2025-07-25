'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import Editor from '@monaco-editor/react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { snippetSchema } from '@/schemas/snippet';
import { createSnippet } from '@/actions/snippet';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languageOptions = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'json',
  'markdown',
  'c',
  'cpp',
  'java',
  'php',
  'go',
  'ruby',
  'rust',
  'shell',
];

export default function SnippetSheet() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('javascript');

  const form = useForm<z.infer<typeof snippetSchema>>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      language: selectedLang,
      content: '',
      description: '',
      visibility: 'public',
    },
  });

  const mutation = useMutation({
    mutationFn: createSnippet,
    onSuccess: () => {
      toast.success('Snippet created');
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      form.reset();
      setOpen(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (values: z.infer<typeof snippetSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='default'>New Snippet</Button>
      </SheetTrigger>

      <SheetContent className='flex w-full flex-col bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] sm:max-w-3xl'>
        <SheetHeader>
          <SheetTitle>Create a New Snippet</SheetTitle>
          <SheetDescription>Write and save your code</SheetDescription>
        </SheetHeader>

        <div className='flex-1 overflow-y-auto'>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex flex-col gap-4 py-4'
          >
            {/* Language */}
            <div className='grid gap-2'>
              <Label htmlFor='language'>Language</Label>
              <Select
                value={selectedLang}
                onValueChange={(val) => {
                  setSelectedLang(val);
                  form.setValue('language', val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select language' />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visibility */}
            <div className='grid gap-2'>
              <Label htmlFor='visibility'>Visibility</Label>
              <Select
                value={form.watch('visibility')}
                onValueChange={(val) =>
                  form.setValue('visibility', val as 'public' | 'private')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select visibility' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='public'>Public</SelectItem>
                  <SelectItem value='private'>Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Code Editor */}
            <div className='grid gap-2'>
              <Label htmlFor='content'>Code</Label>
              <Editor
                height='400px'
                language={selectedLang}
                value={form.watch('content')}
                theme='vs-dark'
                onChange={(value) => form.setValue('content', value || '')}
                options={{
                  fontSize: 14,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 20 },
                }}
              />
            </div>

            {/* Description */}
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='Describe what this snippet does...'
                {...form.register('description')}
              />
            </div>

            {/* Buttons */}
            <div className='mt-4 flex gap-2'>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save Snippet'}
              </Button>
              <SheetClose asChild>
                <Button variant='outline' type='button'>
                  Cancel
                </Button>
              </SheetClose>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
