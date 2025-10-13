// import React from 'react';
// import { cva, VariantProps } from 'class-variance-authority';
// import { Button } from '../ui/button';
// import { filter } from '@/app/components/filters/logoFilter';

// // const buttonVariants = cva(
// //   'inline-flex items-center gap-2 rounded-2xl px-4 py-2 transition-all duration-200 border border-white/20 dark:border-white/10',
// //   {
// //     variants: {
// //       variant: {
// //         normal:
// //           'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100',
// //         active:
// //           'text-grok-teal-600 border-grok-teal-600 hover:text-grok-teal-700',
// //         disabled:
// //           'text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-60',
// //       },
// //     },
// //     defaultVariants: {
// //       variant: 'normal',
// //     },
// //   }
// // );

// interface ButtonWithIconProps extends VariantProps<typeof buttonVariants> {
//   label: string;
//   icon: React.ReactNode;
//   onClick?: () => void;
//   disabled?: boolean;
//   className?: string;
// }

// const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
//   label,
//   icon,
//   onClick,
//   disabled = false,
//   variant = 'normal',
//   className = '',
// }) => {
//   const filterStyle = {
//     filter:
//       'drop-shadow(0 0 10px var(--filter-color)) brightness(0) saturate(100%) invert(60%) sepia(100%) hue-rotate(180deg)',
//   };

//   return (
//     <Button
//       onClick={onClick}
//       // variant={variant} // ✅ matches ButtonVariant
//       className={`flex items-center gap-1 ${className ?? ''}`}
//       style={{ filter }}
//     >
//       {icon}
//       <span className='hidden sm:inline'>{label}</span>
//     </Button>
//   );
// };

// export default ButtonWithIcon;
import React from 'react';

export default function ButtonWithIcon() {
  return <div>ButtonWithIcon</div>;
}
