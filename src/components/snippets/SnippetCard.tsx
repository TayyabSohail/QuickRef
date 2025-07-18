import { Button } from '@/components/ui/button';
import type { Snippet } from '@/types/dao';

type ExtendedSnippet = Snippet & {
  username: string;
  description?: string;
};

type SnippetCardProps = {
  snippet: ExtendedSnippet;
  onView: (snippet: ExtendedSnippet) => void;
};

export default function SnippetCard({ snippet, onView }: SnippetCardProps) {
  return (
    <div className='space-y-2 rounded-lg border p-4'>
      <h3 className='text-lg font-bold'>{snippet.content.slice(0, 30)}...</h3>
      <p className='text-sm text-muted-foreground'>
        Lang: {snippet.language} • {snippet.username}
      </p>
      <p className='text-xs text-muted-foreground'>
        {snippet.description ?? 'No description'}
      </p>
      <Button onClick={() => onView(snippet)}>View</Button>
    </div>
  );
}
