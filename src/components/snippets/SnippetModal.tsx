'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSnippet, updateSnippet } from '@/actions/snippet';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { snippetSchema } from '@/schemas/snippet';
import { z } from 'zod';
import SnippetFormEditor from './SnippetFormEditor';
import type { Snippet, SnippetModalMode } from '@/types/dao';

type Props = {
  snippet: Snippet;
  mode: SnippetModalMode;
  onClose: () => void;
};

export default function SnippetModal({ snippet, mode, onClose }: Props) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isOwner = user?.id === snippet?.user_id;

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
    mutationFn: (data: z.infer<typeof snippetSchema>) =>
      updateSnippet(snippet.id, data),
    onSuccess: () => {
      toast.success('Snippet updated');
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
      onClose();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (values: z.infer<typeof snippetSchema>) => {
    if (mode === 'add') {
      create.mutate(values);
    } else if (mode === 'edit') {
      update.mutate(values);
    }
  };

  const finalMode =
    mode === 'view' || (mode === 'edit' && !isOwner) ? 'view' : mode;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-4xl rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-xl'>
        <DialogHeader>
          <DialogTitle>
            {finalMode === 'add'
              ? 'New Snippet'
              : finalMode === 'view'
                ? 'View Snippet'
                : 'Edit Snippet'}
          </DialogTitle>
        </DialogHeader>

        <SnippetFormEditor
          mode={finalMode}
          defaultValues={snippet}
          onSubmit={handleSubmit}
          isLoading={create.isPending || update.isPending}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
