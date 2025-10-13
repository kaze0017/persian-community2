import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // adjust your firebase import
import { uploadImage } from '../../../services/storageService'; // your upload function
import { Event } from '@/types/event';

// Add event
export const addEvent = async (
  clientId: string,
  event: Omit<Event, 'id'>,
  bannerFile?: File
): Promise<Event> => {
  try {
    // Generate event doc
    const userEventsRef = collection(db, 'users', clientId, 'events');
    const eventRef = doc(userEventsRef); // auto ID
    const eventId = eventRef.id;

    console.log('User Events userId and eventId:', clientId, eventId);
    let bannerUrl: string | undefined = undefined;

    // Upload banner if provided
    if (bannerFile) {
      bannerUrl = await uploadImage(
        bannerFile,
        `clients/${clientId}/events/${eventId}/banner`,
        'banner.jpg'
      );
    }

    const newEvent: Event = {
      ...event,
      id: eventId,
      bannerUrls: bannerUrl ? { sizes: { small: bannerUrl, medium: bannerUrl, large: bannerUrl, xlarge: bannerUrl } } : undefined,
      clientId,
    };

    // Save under user subcollection
    await setDoc(eventRef, newEvent);

    // Save a lightweight copy in global events collection
    const globalRef = doc(db, 'events', eventId);
    await setDoc(globalRef, {
      id: eventId,
      title: event.title,
      description: event.description,
      date: event.date,
      bannerUrls: bannerUrl ? { sizes: { large: bannerUrl, medium: bannerUrl, small: bannerUrl } } : undefined,
      clientId,
    });

    return newEvent;
  } catch (err) {
    console.error('❌ Failed to add event:', err);
    throw err;
  }
};

// Get all events for a user
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  const userEventsRef = collection(db, 'users', userId, 'events');
  const snapshot = await getDocs(userEventsRef);
  return snapshot.docs.map((doc) => doc.data() as Event);
};

// Get single event
export const getEvent = async (
  userId: string,
  eventId: string
): Promise<Event | null> => {
  const eventRef = doc(db, 'users', userId, 'events', eventId);
  const snapshot = await getDoc(eventRef);
  return snapshot.exists() ? (snapshot.data() as Event) : null;
};

// Update event
export const updateEvent = async (
  clientId: string,
  id: string,
  updates: Partial<Event>,
  bannerFile?: File
) => {
  try {
    console.log("Updating event 0:", 'clientId:', clientId, 'id:', id, 'updates:', updates);

    const eventRef = doc(db, "users", clientId, "events", id);
    updates.clientId = clientId; // Ensure clientId is set

    console.log("Updating event 0.1:", id, "with updates:", updates);

    // Handle banner upload
    let bannerUrl: string | undefined = updates.bannerUrls?.sizes.large;
    if (bannerFile) {
      bannerUrl = await uploadImage(
        bannerFile,
        `clients/${clientId}/events/${id}/banner`,
        "banner.jpg"
      );
      updates.bannerUrls = {
        sizes: {
          large: bannerUrl,
          medium: bannerUrl,
          small: bannerUrl,
          xlarge: bannerUrl,
        },
      };
    }

    console.log("Updating event 1:", id, "with updates:", updates);

    // Update event under user
    await setDoc(eventRef, updates, { merge: true });

    // Update global event summary
    const globalRef = doc(db, "events", id);
    await updateDoc(globalRef, {
      ...("title" in updates ? { title: updates.title } : {}),
      ...("description" in updates ? { description: updates.description } : {}),
      ...("date" in updates ? { date: updates.date } : {}),
      ...("clientId" in updates ? { clientId: updates.clientId } : {}),
      ...(bannerUrl
        ? {
            bannerUrls: {
              sizes: {
                large: bannerUrl,
                medium: bannerUrl,
                small: bannerUrl,
                xlarge: bannerUrl,
              },
            },
          }
        : {}),
      clientId,
    });

    console.log("Event updated successfully:", id);
  } catch (err) {
    console.error("updateEvent error:", err);
  }
};


// Delete event
export const deleteEvent = async (userId: string, eventId: string) => {
  const eventRef = doc(db, 'users', userId, 'events', eventId);
  await deleteDoc(eventRef);

  const globalRef = doc(db, 'events', eventId);
  await deleteDoc(globalRef);
};
