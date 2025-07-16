'use client';

export default function Footer() {
  return (
    <footer className='w-full border-t mt-12 py-6'>
      <div className='max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2'>
        <div>
          &copy; {new Date().getFullYear()} Keivan Kazemi —{' '}
          <a
            href='mailto:64kazemi@gmail.com'
            className='text-blue-600 hover:underline'
          >
            your-email@example.com
          </a>
        </div>
      </div>
    </footer>
  );
}
