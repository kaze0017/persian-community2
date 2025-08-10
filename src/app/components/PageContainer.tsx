import React from 'react';

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className='
    relative min-h-screen
    bg-white/10 backdrop-blur-xl
    text-white
    p-4
    rounded-xl
    shadow-lg
  '
    >
      {children}
    </main>
  );
}
