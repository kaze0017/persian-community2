import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className='
        w-full
        border-t border-white/20
        bg-white/10 backdrop-blur-md
        shadow-lg rounded-2xl
        flex flex-col items-center
        p-4 gap-4
        mt-12
      '
    >
      <div className='max-w-5xl w-full flex flex-col md:flex-row justify-between items-center gap-4'>
        {/* Left side */}
        <div className='text-white/80 text-sm text-center md:text-left'>
          &copy; {new Date().getFullYear()} Keivan Kazemi —{' '}
          <a
            href='mailto:keivan.kazm@gmail.com'
            className='text-primary hover:underline'
          >
            keivan.kazm@gmail.com
          </a>
        </div>

        {/* Right side — Social Links */}
        <div className='flex gap-4'>
          <a
            href='www.linkedin.com/in/keivankazemi'
            target='_blank'
            rel='noopener noreferrer'
            className='p-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 transition-colors'
            aria-label='LinkedIn'
          >
            <Linkedin className='text-white' size={18} />
          </a>
          {/* <a
            href='https://github.com/keivankazemi'
            target='_blank'
            rel='noopener noreferrer'
            className='p-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 transition-colors'
            aria-label='GitHub'
          >
            <Github className='text-white' size={18} />
          </a> */}
          <a
            href='mailto:keivan.kazm@gmail.com'
            className='p-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 transition-colors'
            aria-label='Email'
          >
            <Mail className='text-white' size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
