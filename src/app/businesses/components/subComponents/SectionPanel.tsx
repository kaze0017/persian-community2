import { cardClass } from '@/app/components/filters/logoFilter';
import React from 'react';

export default function SectionPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={`space-y-4 border rounded-xl p-4 ${cardClass} `}>
      {children}
    </section>
  );
}
