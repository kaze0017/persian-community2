'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import IconPicker from '@/app/admin/events/add-event/components/IconPicker';

type Props = {
  dayIndex: number;
  namePrefix: string; // e.g., 'days.0'
};

export default function EventDayPanel({ dayIndex, namePrefix }: Props) {
  const { control, register, watch, setValue } = useFormContext();

  const {
    fields: blockFields,
    append: appendBlock,
    remove: removeBlock,
  } = useFieldArray({
    control,
    name: `${namePrefix}.blocks`,
  });

  return (
    <div className='border rounded-xl p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <label className='font-medium'>Day {dayIndex + 1} Date</label>
        <Input
          type='date'
          {...register(`${namePrefix}.date`, { required: true })}
          className='max-w-[200px]'
        />
      </div>

      <Accordion type='multiple' className='space-y-2'>
        {blockFields.map((block, blockIndex) => {
          const blockName = `${namePrefix}.blocks.${blockIndex}`;
          const selectedIcon = watch(`${blockName}.iconName`);

          return (
            <AccordionItem
              key={block.id}
              value={`block-${dayIndex}-${blockIndex}`}
            >
              <AccordionTrigger>
                Block {blockIndex + 1}:{' '}
                {watch(`${blockName}.title`) || 'Untitled'}
              </AccordionTrigger>
              <AccordionContent className='space-y-3 p-3'>
                <Input
                  placeholder='Title'
                  {...register(`${blockName}.title`, { required: true })}
                />
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    type='time'
                    placeholder='Start Time'
                    {...register(`${blockName}.start`, { required: true })}
                  />
                  <Input
                    type='time'
                    placeholder='End Time'
                    {...register(`${blockName}.end`, { required: true })}
                  />
                </div>
                <Textarea
                  placeholder='Activities (comma-separated)'
                  {...register(`${blockName}.activities`)}
                />
                {/* Icon Picker */}
                <div>
                  <label className='block font-medium mb-1'>Select Icon</label>
                  <IconPicker
                    selectedIcon={selectedIcon}
                    onSelect={(iconName) =>
                      setValue(`${blockName}.iconName`, iconName, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  />
                </div>

                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => removeBlock(blockIndex)}
                >
                  Remove Block
                </Button>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Button
        type='button'
        variant='secondary'
        onClick={() =>
          appendBlock({
            title: '',
            start: '',
            end: '',
            activities: '',
            iconName: undefined,
          })
        }
      >
        + Add Block
      </Button>
    </div>
  );
}
