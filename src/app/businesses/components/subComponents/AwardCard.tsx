'use client';

import Image from 'next/image';
import { BusinessReward } from '@/types/business';
import { Trash2 } from 'lucide-react';

interface RewardCardProps {
  reward: BusinessReward;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function AwardCard({
  reward,
  isAdmin,
  onDelete,
}: RewardCardProps) {
  return (
    <div className='relative flex flex-col items-center text-center gap-1 pb-3'>
      {isAdmin && onDelete && (
        <button
          onClick={() => onDelete(reward.id)}
          className='absolute top-1.5 right-1.5 text-gray-500 hover:text-red-600'
          aria-label='Delete reward'
        >
          <Trash2 size={16} />
        </button>
      )}

      {reward.imageUrl && (
        <div className='w-30 h-30 mb-1 relative rounded-full overflow-hidden'>
          <Image
            src={reward.imageUrl || reward.iconUrl!}
            alt={reward.name}
            fill
            className='object-cover rounded-full'
          />
        </div>
      )}

      <h3 className='text-base font-semibold'>{reward.name}</h3>

      {reward.description && (
        <p className='text-xs text-gray-600 whitespace-pre-line leading-tight'>
          {reward.description}
        </p>
      )}
    </div>
  );
}
