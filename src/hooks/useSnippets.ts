import { useQuery } from '@tanstack/react-query';
import { getSnippets } from '@/actions/snippet';

type SnippetQueryParams = {
  filterMine: boolean;
  searchQuery: string;
};

export const useSnippets = ({
  filterMine,
  searchQuery,
}: SnippetQueryParams) => {
  return useQuery({
    queryKey: ['snippets', filterMine, searchQuery],
    queryFn: () => getSnippets(filterMine, searchQuery),
    staleTime: 1000 * 60,
  });
};
