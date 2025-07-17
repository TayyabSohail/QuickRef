import { DashboardNavbar } from '@/components/navbar/DashboardNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='min-h-screen px-4 pt-24'>{children}</div>;
}
