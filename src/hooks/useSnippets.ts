import { useQuery } from '@tanstack/react-query';
import { getSnippets } from '@/actions/snippet';
import { SnippetQueryParams } from '@/types/dao';
import { QueryKeys } from '@/constants/query-keys';

export const useSnippets = ({
  filterMine,
  searchQuery,
}: SnippetQueryParams) => {
  return useQuery({
    queryKey: [QueryKeys.SNIPPETS, filterMine, searchQuery],
    queryFn: () => getSnippets(filterMine, searchQuery),
    staleTime: 1000 * 60,
  });
};
