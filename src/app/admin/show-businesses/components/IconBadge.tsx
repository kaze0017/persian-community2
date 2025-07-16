import { LucideIcon } from 'lucide-react';

type IconBadgeProps = {
  value: string;
  Icon: LucideIcon;
  bgColorClass?: string; // Tailwind background class like 'bg-green-600'
};

export function IconBadge({
  value,
  Icon,
  bgColorClass = 'bg-gray-500',
}: IconBadgeProps) {
  return (
    <div className='flex items-center space-x-2'>
      {/* Icon background with triangle */}
      <div className='relative flex items-center'>
        {/* Icon with background */}
        <div className={`p-2 rounded-l-md z-10 ${bgColorClass}`}>
          <Icon className='text-white w-4 h-4' />
        </div>
        {/* Right triangle */}
        <div
          className={`w-0 h-0 border-t-[16px] border-t-transparent
                      border-b-[16px] border-b-transparent
                      border-l-[18px] -ml-0 ${getBorderColor(bgColorClass)}`}
        />
      </div>

      {/* Text value */}
      <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
        {value}
      </span>
    </div>
  );
}

// Helper: convert bg-* to border-l-* for triangle
function getBorderColor(bg: string): string {
  const map: Record<string, string> = {
    'bg-green-600': 'border-l-green-600',
    'bg-blue-600': 'border-l-blue-600',
    'bg-yellow-600': 'border-l-yellow-600',
    'bg-red-600': 'border-l-red-600',
    'bg-gray-500': 'border-l-gray-500',
  };
  return map[bg] || 'border-l-gray-500';
}
