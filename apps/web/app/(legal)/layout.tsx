import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <div className="container py-8 space-y-6">{children}</div>;
}
