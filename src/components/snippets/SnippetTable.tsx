'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSnippet } from '@/actions/snippet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SnippetSheet from './SnippetSheet';
import { useSnippets } from '@/hooks/useSnippets';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import SnippetModal from './SnippetModal';
import { Trash, Eye, Filter, ChevronDown } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import type { ExtendedSnippet } from '@/types/dao';
import { useDebounce } from '@/hooks/useDebounce';
import { SnippetTableProps } from '@/types/dao';

export default function SnippetTable({ showCreate }: SnippetTableProps) {
  const { user } = useUser();
  const [filterMine, setFilterMine] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selected, setSelected] = useState<ExtendedSnippet | null>(null);
  const queryClient = useQueryClient();
  const debouncedSelected = useDebounce(selected, 200);

  const { data: snippets = [], isLoading } = useSnippets({
    filterMine,
    searchQuery: debouncedSearch,
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
    <div className='space-y-4'>
      <DashboardNavbar search={search} setSearch={setSearch} />

      <div className='mx-auto px-8 sm:px-10 lg:max-w-screen-xl'>
        <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <h2 className='text-xl font-semibold'>Code Snippets</h2>
            <p className='text-sm text-muted-foreground'>
              {filterMine ? 'Your snippets' : 'Community snippets'}
            </p>
          </div>

          <div className='flex gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='gap-1 border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                >
                  <Filter className='h-3.5 w-3.5' />
                  <span>{filterMine ? 'Mine' : 'All'}</span>
                  <ChevronDown className='h-3.5 w-3.5 opacity-50' />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='end'
                className='border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-md'
              >
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

        <Card className='mt-4 border-none shadow-sm'>
          <div className='overflow-x-auto'>
            <Table className='min-w-[600px]'>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='w-10'>#</TableHead>
                  <TableHead className='min-w-[120px]'>User</TableHead>
                  <TableHead className='min-w-[100px]'>Visibility</TableHead>
                  <TableHead className='min-w-[100px]'>Language</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className='w-20 pr-4 text-right'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className='h-4 w-4' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-20' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-16' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-16' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-full' />
                      </TableCell>
                      <TableCell className='flex justify-end gap-1 pr-4'>
                        <Skeleton className='h-7 w-7 rounded-full' />
                        <Skeleton className='h-7 w-7 rounded-full' />
                      </TableCell>
                    </TableRow>
                  ))
                ) : snippets.length > 0 ? (
                  snippets.map((snippet, index) => (
                    <TableRow key={snippet.id} className='group'>
                      <TableCell className='font-medium'>{index + 1}</TableCell>
                      <TableCell className='truncate font-medium'>
                        {snippet.username || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium capitalize',
                            snippet.visibility === 'private'
                              ? 'bg-[hsla(var(--visibility-private-bg))] text-[hsla(var(--visibility-private-text))]'
                              : 'bg-[hsla(var(--visibility-public-bg))] text-[hsla(var(--visibility-public-text))]',
                          )}
                        >
                          {snippet.visibility}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex h-6 items-center rounded-md px-2.5 text-xs font-medium',
                            'bg-[hsla(var(--primary)/0.1)] text-[hsla(var(--primary))] dark:bg-[hsla(var(--primary)/0.2)]',
                          )}
                        >
                          {snippet.language}
                        </span>
                      </TableCell>
                      <TableCell className='max-w-[200px] truncate'>
                        {snippet.description}
                      </TableCell>
                      <TableCell className='pr-4'>
                        <div className='flex justify-end gap-1'>
                          {/* Eye Button (always visible) */}
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-7 w-7 rounded-full p-0 text-muted-foreground hover:bg-[hsla(var(--action-hover-bg))] hover:text-[hsla(var(--action-hover-text))]'
                            onClick={() => setSelected(snippet)}
                          >
                            <Eye className='h-3.5 w-3.5' />
                          </Button>

                          {/* Trash Button (render invisible if not owner) */}
                          {user?.id === snippet.user_id ? (
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-7 w-7 rounded-full p-0 text-destructive hover:bg-destructive/10'
                              onClick={() => deleteMutation.mutate(snippet.id)}
                            >
                              <Trash className='h-3.5 w-3.5' />
                            </Button>
                          ) : (
                            <div className='h-7 w-7' /> // Invisible placeholder to keep alignment
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className='h-24 text-center'>
                      No snippets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {debouncedSelected && (
        <SnippetModal
          snippet={debouncedSelected}
          onClose={() => setSelected(null)}
          mode={
            user?.id === debouncedSelected?.user_id
              ? debouncedSelected.id
                ? 'edit'
                : 'add'
              : 'view'
          }
        />
      )}
    </div>
  );
}
