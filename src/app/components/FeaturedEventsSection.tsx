import EventCarousel from './subComponents/EventCarousel';
import { Event } from '@/types/event';

export default async function FeaturedEventsSection({
  events,
}: {
  events: Event[];
}) {
  if (!events || events.length === 0) {
    return <p>No featured events available.</p>;
  }

  return <EventCarousel events={events} />;
}
