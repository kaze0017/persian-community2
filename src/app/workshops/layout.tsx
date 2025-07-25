import MainContainer from '@/components/MainContainer';

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainContainer>
      <>{children}</>
    </MainContainer>
  );
}
