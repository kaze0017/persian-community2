import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Person } from '@/types/person';

interface PeopleListProps {
  onEdit?: (person: Person) => void;
  onSendConnectionRequest?: (person: Person) => void;
  people: Person[];
}

const PeopleList: React.FC<PeopleListProps> = ({
  onEdit,
  onSendConnectionRequest,
  people,
}) => {
  return (
    <div className='grid grid-cols-1 gap-4'>
      {people.map((person) => (
        <Card key={person.id} className='p-4'>
          <CardContent className='p-0 flex flex-col sm:flex-row items-center gap-4 justify-between'>
            <div className='flex gap-4 items-center max-w-[70%]'>
              {person.photoUrl ? (
                <Image
                  src={person.photoUrl}
                  alt={person.name}
                  width={64}
                  height={64}
                  className='w-16 h-16 rounded-full object-cover'
                />
              ) : (
                <div className='w-16 h-16 min-w-16 min-h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl font-semibold select-none flex-shrink-0'>
                  {person.name?.charAt(0) || '?'}
                </div>
              )}

              <div className='space-y-1 text-sm truncate'>
                <h3 className='text-base font-semibold truncate'>
                  {person.name}
                </h3>

                {person.bio && (
                  <p className='text-muted-foreground line-clamp-2'>
                    {person.bio}
                  </p>
                )}
                {person.linkedInUrl && (
                  <a
                    href={person.linkedInUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 underline text-xs'
                  >
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>

            <div className='flex flex-col items-end gap-2 sm:items-end w-full sm:w-auto'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onEdit?.(person)}
                className='w-full sm:w-28'
              >
                Edit
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onSendConnectionRequest?.(person)}
                disabled={person.connectedWithLinkedIn}
                title={
                  person.connectedWithLinkedIn
                    ? 'Already connected to LinkedIn'
                    : 'Send connection request'
                }
                className='w-full text-wrap break-words whitespace-normal'
              >
                Send Linkedin Connect Req.
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PeopleList;
