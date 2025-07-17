import { cn } from '@/lib/utils';
import React from 'react';

interface GridSmallBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  height?: string;
}

export function GridSmallBackground({
  children,
  className,
  height = 'min-h-screen',
  ...props
}: GridSmallBackgroundProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        height,
        'bg-[var(--background)] text-[var(--foreground)]',
        className,
      )}
      {...props}
    >
      {/* Grid pattern background */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-0',
          '[background-size:24px_24px]',
          '[background-image:linear-gradient(to_right,var(--grid-line,rgba(0,0,0,0.05))_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line,rgba(0,0,0,0.05))_1px,transparent_1px)]',
        )}
      />

      {/* Optional radial soft mask */}
      <div className='pointer-events-none absolute inset-0 z-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />

      {/* Main content */}
      <div className='relative z-20'>{children}</div>
    </div>
  );
}
