import { CardContent } from '@/components/ui/card';
import {
  boxShadow,
  filter,
  textGlow,
} from '@/app/components/filters/logoFilter';
import { useRouter } from 'next/navigation';
import { Event } from '@/types/event';
import Image from 'next/image';

type EventCardProps = {
  event: Event | null;
  section?: 'user' | 'client' | 'admin';
};

export default function EventCard({ event, section }: EventCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!event?.id) {
      router.push('/client/events/create');
      return;
    }

    const paths: Record<string, string> = {
      user: `/businesses/${event.id}`,
      client: `/client/businesses/${event.id}`,
      admin: `/admin/businesses/${event.id}`,
    };

    if (section && paths[section]) {
      router.push(paths[section]);
    }
  };

  return (
    <CardContent
      onClick={handleClick}
      className='p-4 h-32 backdrop-blur-3xl rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/10 flex items-center cursor-pointer'
      style={{ boxShadow }}
    >
      <div className='flex items-center gap-4 w-full'>
        <div className='relative flex flex-col items-center justify-center gap-2 p-4 w-30 h-30'>
          <Image
            src={event ? '/images/calender.png' : '/images/plus.webp'}
            alt={event ? event.title : 'Add Event'}
            width={event ? 64 : 140}
            height={event ? 64 : 140}
            className={textGlow}
            style={{
              position: event ? 'relative' : 'absolute',
              zIndex: -1,
              filter: filter,
            }}
          />
          {event && (
            <div className='text-center'>
              <span className='block text-2xl font-bold'>
                {new Date(event.date).getDate()}
              </span>
              <span className='block text-sm'>
                {new Date(event.date).toLocaleString('default', {
                  month: 'short',
                })}
              </span>
            </div>
          )}
        </div>
        <div>
          {event && (
            <>
              <h3 className='text-lg font-semibold'>{event.title}</h3>
              <p className='text-sm text-gray-300 line-clamp-3'>
                {event.description || 'No description available'}
              </p>
            </>
          )}
          {!event && <h3 className='text-lg font-semibold'>Add New</h3>}
        </div>
      </div>
    </CardContent>
  );
}
