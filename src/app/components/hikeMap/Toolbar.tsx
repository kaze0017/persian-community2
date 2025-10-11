import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  return (
    <TooltipProvider>
      <div className=' bg-gray-50 dark:bg-gray-900 p-3 rounded-lg shadow-md flex gap-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setTool(activeTool === 'draw' ? null : 'draw')}
              variant={activeTool === 'draw' ? 'default' : 'outline'}
              className={
                activeTool === 'draw'
                  ? 'bg-grok-teal-600 hover:bg-grok-teal-700 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            >
              Draw Path
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add points to the trail path</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setTool(activeTool === 'pin' ? null : 'pin')}
              variant={activeTool === 'pin' ? 'default' : 'outline'}
              className={
                activeTool === 'pin'
                  ? 'bg-grok-teal-600 hover:bg-grok-teal-700 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            >
              Drop Pin
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a marker with details</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleUndo}
              disabled={!canUndo}
              variant='outline'
              className={
                canUndo
                  ? 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'opacity-50 cursor-not-allowed'
              }
            >
              Undo
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo the last action</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleRedo}
              disabled={!canRedo}
              variant='outline'
              className={
                canRedo
                  ? 'hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'opacity-50 cursor-not-allowed'
              }
            >
              Redo
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo the last undone action</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onSave}
              variant='default'
              className='bg-grok-teal-600 hover:bg-grok-teal-700 text-white'
            >
              Save All
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save all map data</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onCancel}
              variant='outline'
              className='border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            >
              Cancel
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Discard changes</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default memo(Toolbar);
