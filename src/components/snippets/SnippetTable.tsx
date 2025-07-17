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
import { cn } from '@/lib/utils';
import { DashboardNavbar } from '@/components/navbar/DashboardNavbar';

type SnippetTableProps = {
  showCreate?: boolean;
};

export default function SnippetTable({ showCreate }: SnippetTableProps) {
  const { user } = useUser();
  const [filterMine, setFilterMine] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data: snippets = [] } = useQuery({
    queryKey: ['snippets', filterMine, search],
    queryFn: () => getSnippets(filterMine, search),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSnippet(id),
    onSuccess: () => {
      toast.success('Snippet deleted');
      queryClient.invalidateQueries({ queryKey: ['snippets'] });
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <>
      {/* ✅ Navbar with Search */}
      <DashboardNavbar search={search} setSearch={setSearch} />

      <div className='space-y-4 pt-10'>
        {/* Header Section */}
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div className='ml-auto flex gap-2'>
            {/* Dropdown to toggle mine/all */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='bg-secondary text-secondary-foreground hover:bg-secondary/90'>
                  {filterMine ? 'Viewing: Mine' : 'Viewing: All'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='border border-border bg-background shadow-md'>
                <DropdownMenuItem onClick={() => setFilterMine(false)}>
                  View All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterMine(true)}>
                  View Mine
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user && <SnippetSheet />}
          </div>
        </div>

        {/* Table Section */}
        <Card className='overflow-x-auto'>
          <Table className='min-w-[850px] text-base'>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='text-[0.95rem]'>#</TableHead>
                <TableHead className='text-[0.95rem]'>Username</TableHead>
                <TableHead className='text-[0.95rem]'>Role</TableHead>
                <TableHead className='text-[0.95rem]'>Visibility</TableHead>
                <TableHead className='text-[0.95rem]'>Language</TableHead>
                <TableHead className='text-[0.95rem]'>Description</TableHead>
                <TableHead className='text-[0.95rem]'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snippets.map((snippet, index) => {
                const isOwner = user?.id === snippet.user_id;
                const role = isOwner ? 'Owner' : 'Viewer';

                return (
                  <TableRow key={snippet.id} className='hover:bg-secondary/20'>
                    <TableCell className='font-medium'>{index + 1}</TableCell>
                    <TableCell className='font-medium'>
                      {snippet.username || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-sm font-medium',
                          isOwner
                            ? 'bg-[hsla(var(--label-owner-bg))] text-[hsla(var(--label-owner-text))]'
                            : 'bg-[hsla(var(--label-viewer-bg))] text-[hsla(var(--label-viewer-text))]',
                        )}
                      >
                        {role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'rounded-full px-3 py-1 text-sm font-medium capitalize',
                          snippet.visibility === 'private'
                            ? 'bg-[hsla(var(--visibility-private-bg))] text-[hsla(var(--visibility-private-text))]'
                            : 'bg-[hsla(var(--visibility-public-bg))] text-[hsla(var(--visibility-public-text))]',
                        )}
                      >
                        {snippet.visibility}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className='rounded-lg bg-[hsla(var(--primary)/0.1)] px-3 py-1.5 text-sm font-medium text-[hsla(var(--primary))] dark:bg-[hsla(var(--primary)/0.2)]'>
                        {snippet.language}
                      </span>
                    </TableCell>
                    <TableCell className='max-w-[200px] truncate text-[0.95rem]'>
                      {snippet.description}
                    </TableCell>
                    <TableCell className='flex items-center gap-2'>
                      <Button
                        size='sm'
                        variant='default'
                        className='h-8 px-3 text-sm'
                        onClick={() => setSelected(snippet)}
                      >
                        View
                      </Button>
                      {isOwner && (
                        <Button
                          size='sm'
                          variant='destructive'
                          className='h-8 px-3 text-sm'
                          onClick={() => deleteMutation.mutate(snippet.id)}
                        >
                          <Trash className='h-2 w-2' />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Modal */}
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
    </>
  );
}
