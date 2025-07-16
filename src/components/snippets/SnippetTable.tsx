'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSnippets, deleteSnippet } from '@/actions/snippet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SnippetSheet from './SnippetSheet';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import SnippetModal from './SnippetModal';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/hooks/useUser';

type SnippetTableProps = {
  showCreate?: boolean;
};

export default function SnippetTable({ showCreate }: SnippetTableProps) {
  const { user, isLoading: userLoading } = useUser();
  const [filterMine, setFilterMine] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data: snippets = [], error } = useQuery({
    queryKey: ['snippets', filterMine],
    queryFn: () => getSnippets(filterMine),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSnippet(id),
    onSuccess: () => {
      toast.success('Snippet deleted');
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: (err) => toast.error(err.message),
  });

  const filteredSnippets = snippets;

  return (
    <div className='space-y-4'>
      {/* Header Section */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>QuickRef</h1>

        <div className='flex gap-2'>
          {/* View Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                {filterMine ? 'Viewing: Mine' : 'Viewing: All'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterMine(false)}>
                View All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterMine(true)}>
                View Mine
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add New Snippet - visible to all logged-in users */}
          {user && <SnippetSheet />}
        </div>
      </div>

      {/* Table Section */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Row ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSnippets.map((snippet, index) => {
              const isOwner = user?.id === snippet.user_id;
              const role = isOwner ? 'Owner' : 'Viewer';

              return (
                <TableRow key={snippet.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{snippet.username || 'Unknown'}</TableCell>
                  <TableCell>{role}</TableCell>
                  <TableCell>{snippet.language}</TableCell>
                  <TableCell className='max-w-[200px] truncate'>
                    {snippet.description}
                  </TableCell>
                  <TableCell className='flex gap-2'>
                    <Button size='sm' onClick={() => setSelected(snippet)}>
                      View
                    </Button>

                    {isOwner && (
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => deleteMutation.mutate(snippet.id)}
                      >
                        <Trash className='h-4 w-4' />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Modal Logic */}
      {selected && (
        <SnippetModal
          snippet={selected}
          onClose={() => setSelected(null)}
          mode={
            user?.id === selected?.user_id
              ? selected.id
                ? 'edit'
                : 'add'
              : 'view'
          }
        />
      )}
    </div>
  );
}
