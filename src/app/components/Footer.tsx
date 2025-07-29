import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='w-full border-t mt-12 py-6'>
      <div className='max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2'>
        <div className='text-foreground text-sm'>
          &copy; {new Date().getFullYear()} Keivan Kazemi —{' '}
          <a
            href='mailto:64kazemi@gmail.com'
            className='text-primary hover:underline'
          >
            64kazemi@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
