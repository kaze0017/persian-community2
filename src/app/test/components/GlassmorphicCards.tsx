import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Globe } from 'lucide-react';

export default function GlassmorphicCards() {
  return (
    <div className='min-h-screen bg-neutral-900 flex items-center justify-center p-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl'>
        {/* Minimalist Glassmorphic */}
        <Card className='w-[300px] h-[180px] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg flex flex-col justify-center items-center text-center'>
          <CardContent>
            <h2 className='text-xl font-semibold text-white'>JOHN DOE</h2>
            <p className='text-gray-300 text-sm'>Graphic Designer</p>
            <div className='mt-4 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_#06b6d4]' />
          </CardContent>
        </Card>

        {/* Minimalist Glassmorphic - Back */}
        <Card className='w-[300px] h-[180px] rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg p-6 text-white'>
          <h2 className='text-lg font-semibold'>JOHN DOE</h2>
          <p className='text-gray-300 mb-4'>Graphic Designer</p>
          <div className='flex flex-col gap-2 text-sm'>
            <div className='flex items-center gap-2'>
              <Phone size={14} className='text-cyan-400' />
              +123 456 7890
            </div>
            <div className='flex items-center gap-2'>
              <Mail size={14} className='text-cyan-400' />
              john.doe@example.com
            </div>
            <div className='flex items-center gap-2'>
              <Globe size={14} className='text-cyan-400' />
              www.example.com
            </div>
          </div>
        </Card>

        {/* Corporate & Professional */}
        <Card className='w-[300px] h-[180px] rounded-2xl border border-white/20 bg-gradient-to-br from-white/40 to-gray-200/20 backdrop-blur-md shadow-lg flex flex-col justify-center items-center text-black'>
          <CardContent className='flex flex-col items-center gap-2'>
            <div className='text-2xl font-bold'>©</div>
            <h2 className='text-lg font-semibold'>COMPANY</h2>
          </CardContent>
        </Card>

        {/* Corporate & Professional - Back */}
        <Card className='w-[300px] h-[180px] rounded-2xl border border-white/20 bg-gradient-to-br from-white/40 to-gray-200/20 backdrop-blur-md shadow-lg p-6 text-black'>
          <h2 className='text-lg font-semibold'>COMPANY</h2>
          <div className='flex flex-col gap-2 text-sm mt-4'>
            <div className='flex items-center gap-2'>
              <Phone size={14} />
              +123 456 7880
            </div>
            <div className='flex items-center gap-2'>
              <Mail size={14} />
              hello@company.com
            </div>
            <div className='flex items-center gap-2'>
              <Globe size={14} />
              www.example.com
            </div>
          </div>
        </Card>

        {/* Luxury & Premium */}
        <Card className='w-[300px] h-[180px] rounded-2xl border border-yellow-500/30 bg-black/50 backdrop-blur-md shadow-lg flex flex-col justify-center items-center text-center'>
          <CardContent>
            <h2 className='text-2xl font-serif text-yellow-500'>LUXURY</h2>
            <p className='text-yellow-500 tracking-widest'>PREMIUM</p>
          </CardContent>
        </Card>

        {/* Luxury & Premium - Back */}
        <Card className='w-[300px] h-[180px] rounded-2xl border border-yellow-500/30 bg-black/50 backdrop-blur-md shadow-lg p-6 text-yellow-500 font-serif'>
          <h2 className='text-lg font-semibold'>JOHN DOE</h2>
          <p className='mb-4'>FOUNDER</p>
          <div className='flex flex-col gap-2 text-sm'>
            <div className='flex items-center gap-2'>
              <Phone size={14} />
              +125 456 7890
            </div>
            <div className='flex items-center gap-2'>
              <Mail size={14} />
              john.doe@example.com
            </div>
            <div className='flex items-center gap-2'>
              <Globe size={14} />
              www.example.com
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
