import type { ReactNode } from 'react';

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border shadow-sm hover:shadow-md transition-shadow bg-white ${className || ''}`}>
      {children}
    </div>
  );
}
