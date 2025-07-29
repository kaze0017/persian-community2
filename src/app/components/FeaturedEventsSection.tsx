import EventCarousel from './subComponents/EventCarousel';
import EventCarouselSkeleton from './subComponents/EventCarouselSkeleton';
import { getFeaturedEvents } from '@/lib/events';
import { HydrateEvents } from './subComponents/HydrateEvents';

export default async function FeaturedEventsSection() {
  const events = await getFeaturedEvents();

  if (!events || events.length === 0) {
    return <p>No featured events available.</p>;
  }

  return (
    <div className='p-2 w-full'>
      <HydrateEvents events={events}>
        <EventCarousel events={events} />
      </HydrateEvents>
    </div>
  );
}
