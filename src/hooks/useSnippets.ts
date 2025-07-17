import { useQuery } from '@tanstack/react-query';
import { getSnippets } from '@/actions/snippet';

export const useSnippets = (filterMine: boolean, searchQuery: string) => {
  return useQuery({
    queryKey: ['snippets', filterMine, searchQuery],
    queryFn: () => getSnippets(filterMine, searchQuery),
    staleTime: 1000 * 60,
  });
};
