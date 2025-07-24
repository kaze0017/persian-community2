import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { fetchPeople } from '@/app/admin/people/peopleThunks';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import Image from 'next/image';

// interface Person {
//   id: string;
//   name: string;
//   bio?: string;
//   photoUrl?: string;
//   email?: string;
// }
import { UseFormSetValue, UseFormRegister, FieldErrors } from 'react-hook-form';
import { WorkshopFormValues } from '@/app/lib/validators/workshop';
interface InstructorSectionProps {
  register: UseFormRegister<WorkshopFormValues>;
  errors?: FieldErrors<WorkshopFormValues>;
  setValue: UseFormSetValue<WorkshopFormValues>;
  watchInstructor?: WorkshopFormValues['instructor'];
}

export function InstructorSection({
  register,
  errors,
  setValue,
  watchInstructor,
}: InstructorSectionProps) {
  const people = useAppSelector((state) => state.people.people);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (people.length === 0) {
      dispatch(fetchPeople());
    }
  }, [dispatch, people.length]);

  function onSelectPerson(selectedId: string) {
    if (!selectedId) {
      setValue('instructor', {
        id: '',
        name: '',
        bio: '',
        photoUrl: '',
        email: '',
      });
      return;
    }

    const selectedPerson = people.find((p) => p.id === selectedId);
    if (selectedPerson) {
      setValue('instructor', { ...selectedPerson });
    }
  }

  return (
    <>
      <div className='space-y-2'>
        <Label>Choose Instructor from People</Label>
        <div className='flex items-center gap-4'>
          <div className='flex-grow'>
            <Select
              value={watchInstructor?.id || ''}
              onValueChange={onSelectPerson}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='-- Select Person --' />
              </SelectTrigger>
              <SelectContent>
                {people.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {watchInstructor?.photoUrl && (
            <Image
              src={watchInstructor.photoUrl}
              alt={`${watchInstructor.name}'s photo`}
              className='w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600'
              width={48}
              height={48}
            />
          )}
        </div>
      </div>

      <div className='space-y-2 mt-4'>
        <Label>Instructor Name</Label>
        <Input {...register('instructor.name', { required: true })} />
        {errors?.instructor?.name && (
          <p className='text-red-600 text-sm'>
            {errors.instructor.name.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label>Instructor Bio</Label>
        <Textarea {...register('instructor.bio')} />
      </div>
    </>
  );
}
