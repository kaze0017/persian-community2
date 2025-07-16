import React from 'react';

export default function SectionPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className='space-y-4 border rounded-xl p-4'>{children}</section>
  );
}
