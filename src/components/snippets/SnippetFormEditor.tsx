'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Editor from '@monaco-editor/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { snippetSchema } from '@/schemas/snippet';
import { Button } from '@/components/ui/button';

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

type Props = {
  mode: 'view' | 'edit' | 'add';
  defaultValues?: z.infer<typeof snippetSchema>;
  onSubmit: (values: z.infer<typeof snippetSchema>) => void;
  isLoading?: boolean;
  onCancel?: () => void;
};

export default function SnippetFormEditor({
  mode,
  defaultValues,
  onSubmit,
  isLoading = false,
  onCancel,
}: Props) {
  const isReadOnly = mode === 'view';

  const form = useForm<z.infer<typeof snippetSchema>>({
    resolver: zodResolver(snippetSchema),
    defaultValues: defaultValues || {
      language: 'javascript',
      content: '',
      description: '',
      visibility: 'public',
    },
  });

  // Ensure language selection is synced with form state
  const selectedLang = form.watch('language');

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-4 rounded-xl bg-[hsl(var(--card))] p-6 py-4 text-[hsl(var(--card-foreground))] shadow-md'
    >
      <div className='flex flex-col gap-4 md:flex-row'>
        {/* Language dropdown */}
        <div className='grid flex-1 gap-2'>
          <Label htmlFor='language'>Language</Label>
          <select
            id='language'
            className='rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--input))] px-3 py-2 text-[hsl(var(--foreground))]'
            disabled={isReadOnly}
            value={selectedLang}
            onChange={(e) => form.setValue('language', e.target.value)}
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Visibility dropdown */}
        <div className='grid flex-1 gap-2'>
          <Label htmlFor='visibility'>Visibility</Label>
          <select
            id='visibility'
            className='rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--input))] px-3 py-2 text-[hsl(var(--foreground))]'
            disabled={isReadOnly}
            value={form.watch('visibility')}
            onChange={(e) =>
              form.setValue(
                'visibility',
                e.target.value as 'private' | 'public',
              )
            }
          >
            <option value='private'>Private</option>
            <option value='public'>Public</option>
          </select>
        </div>
      </div>

      {/* Monaco Code Editor */}
      <div className='grid gap-2'>
        <Label htmlFor='content'>Code</Label>
        <div className='overflow-hidden rounded-md border border-[hsl(var(--border))]'>
          <Editor
            key={selectedLang}
            height='400px'
            language={selectedLang}
            value={form.watch('content')}
            theme={isReadOnly ? 'vs-dark' : 'vs-dark'} // Set theme dynamically if needed
            onChange={(value) => form.setValue('content', value || '')}
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              minimap: { enabled: false },
              readOnly: isReadOnly,
              automaticLayout: true,
              padding: { top: 20 },
            }}
          />
        </div>
      </div>

      {/* Description */}
      <div className='grid gap-2'>
        <Label htmlFor='description'>Description</Label>
        <Input
          id='description'
          placeholder='Describe what this snippet does...'
          className='border border-[hsl(var(--border))] bg-[hsl(var(--input))] text-[hsl(var(--foreground))]'
          {...form.register('description')}
          readOnly={isReadOnly}
        />
      </div>

      {/* Actions */}
      {mode !== 'view' && (
        <div className='flex gap-2 pt-2'>
          <Button type='submit' disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Snippet'
                : 'Save Snippet'}
          </Button>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      )}
    </form>
  );
}
