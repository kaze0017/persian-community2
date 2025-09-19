import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
export default function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={className}
    >
      <Card className=' rounded-2xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-2xl shadow-lg'>
        <div className='p-4 md:p-6'>{children}</div>
      </Card>
    </motion.div>
  );
}
