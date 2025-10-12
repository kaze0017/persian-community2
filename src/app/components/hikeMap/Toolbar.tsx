'use client';
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Pencil, MapPin, Undo2, Redo2, Save, X } from 'lucide-react';

interface ToolbarProps {
  setTool: (tool: 'draw' | 'pin' | null) => void;
  activeTool: 'draw' | 'pin' | null;
  canUndo: boolean;
  canRedo: boolean;
  handleUndo: () => void;
  handleRedo: () => void;
  onSave: () => void;
  onCancel: () => void;
}

type ButtonVariant =
  | 'default'
  | 'outline'
  | 'link'
  | 'destructive'
  | 'secondary'
  | 'ghost'
  | null
  | undefined;

const Toolbar = ({
  setTool,
  activeTool,
  canUndo,
  canRedo,
  handleUndo,
  handleRedo,
  onSave,
  onCancel,
}: ToolbarProps) => {
  const tools: {
    key: string;
    label: string;
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    variant?: ButtonVariant;
  }[] = [
    {
      key: 'draw',
      label: 'Draw Path',
      icon: <Pencil className='w-4 h-4' />,
      tooltip: 'Add points to the trail path',
      onClick: () => setTool(activeTool === 'draw' ? null : 'draw'),
      active: activeTool === 'draw',
    },
    {
      key: 'pin',
      label: 'Drop Pin',
      icon: <MapPin className='w-4 h-4' />,
      tooltip: 'Add a marker with details',
      onClick: () => setTool(activeTool === 'pin' ? null : 'pin'),
      active: activeTool === 'pin',
    },
    {
      key: 'undo',
      label: 'Undo',
      icon: <Undo2 className='w-4 h-4' />,
      tooltip: 'Undo the last action',
      onClick: handleUndo,
      disabled: !canUndo,
    },
    {
      key: 'redo',
      label: 'Redo',
      icon: <Redo2 className='w-4 h-4' />,
      tooltip: 'Redo the last undone action',
      onClick: handleRedo,
      disabled: !canRedo,
    },
    {
      key: 'save',
      label: 'Save All',
      icon: <Save className='w-4 h-4' />,
      tooltip: 'Save all map data',
      onClick: onSave,
      variant: 'outline',
    },
    {
      key: 'cancel',
      label: 'Cancel',
      icon: <X className='w-4 h-4' />,
      tooltip: 'Discard changes',
      onClick: onCancel,
      variant: 'outline',
    },
  ];

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='relative'
      >
        <div className='rounded-2xl p-4 md:p-6 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl flex flex-wrap items-center gap-2'>
          {tools.map(
            ({
              key,
              label,
              icon,
              tooltip,
              onClick,
              active,
              disabled,
              variant,
            }) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onClick}
                    disabled={disabled}
                    variant={
                      (variant ??
                        (active ? 'default' : 'outline')) as ButtonVariant
                    }
                    className={`flex items-center gap-1 ${
                      active
                        ? 'bg-grok-teal-600 hover:bg-grok-teal-700 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {icon}
                    <span className='hidden sm:inline'>{label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            )
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default memo(Toolbar);
