import SnippetTable from '@/components/snippets/SnippetTable';

export default function ManageDashboard() {
  return (
    <div className='p-6'>
      <SnippetTable showCreate />
    </div>
  );
}
