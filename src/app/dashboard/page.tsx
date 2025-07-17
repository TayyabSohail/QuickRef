// app/dashboard/page.tsx
import SnippetTable from '@/components/snippets/SnippetTable';

export default function DashboardPage() {
  return (
    <div className='p-6'>
      <SnippetTable />
    </div>
  );
}
