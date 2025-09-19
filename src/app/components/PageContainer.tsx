import React from 'react';

export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className='
    relative flex flex-col grow w-full max-w-[1280px] mx-auto
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
