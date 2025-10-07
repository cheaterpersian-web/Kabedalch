import type { ReactNode } from 'react';

export const dynamic = 'force-dynamic';
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="container py-6 space-y-6">{children}</div>;
}
