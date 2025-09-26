import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust your firebase import
import { uploadImage } from "../storageService"; // your upload function
import { Event } from "@/types/event";

// Add event
export const addEvent = async (
  userId: string,
  event: Omit<Event, "id">,
  bannerFile?: File
): Promise<Event> => {
  try {
    // Generate event doc
    const userEventsRef = collection(db, "users", userId, "events");
    const eventRef = doc(userEventsRef); // auto ID
    const eventId = eventRef.id;

    let bannerUrl: string | undefined = undefined;

    // Upload banner if provided
    if (bannerFile) {
      bannerUrl = await uploadImage(
        bannerFile,
        `clients/${userId}/events/${eventId}/banner`,
        "banner.jpg"
      );
    }

    const newEvent: Event = {
      ...event,
      id: eventId,
      bannerUrls: bannerUrl ?  { sizes: { large: bannerUrl } } : undefined,
    };

    // Save under user subcollection
    await setDoc(eventRef, newEvent);

    // Save a lightweight copy in global events collection
    const globalRef = doc(db, "events", eventId);
    await setDoc(globalRef, {
      id: eventId,
      title: event.title,
      description: event.description,
      date: event.date,
      bannerUrl,
    });

    return newEvent;
  } catch (err) {
    console.error("❌ Failed to add event:", err);
    throw err;
  }
};

// Get all events for a user
export const getUserEvents = async (userId: string): Promise<Event[]> => {
  const userEventsRef = collection(db, "users", userId, "events");
  const snapshot = await getDocs(userEventsRef);
  return snapshot.docs.map((doc) => doc.data() as Event);
};

// Get single event
export const getEvent = async (userId: string, eventId: string): Promise<Event | null> => {
  const eventRef = doc(db, "users", userId, "events", eventId);
  const snapshot = await getDoc(eventRef);
  return snapshot.exists() ? (snapshot.data() as Event) : null;
};

// Update event
export const updateEvent = async (
  userId: string,
  eventId: string,
  updates: Partial<Event>,
  bannerFile?: File
) => {
  const eventRef = doc(db, "users", userId, "events", eventId);

  let bannerUrl: string | undefined = updates.bannerUrls?.sizes.large;
  if (bannerFile) {
    bannerUrl = await uploadImage(
      bannerFile,
      `clients/${userId}/events/${eventId}/banner`,
      "banner.jpg"
    );
    updates.bannerUrls = { sizes: { large: bannerUrl } };
  }

  await updateDoc(eventRef, updates);

  // Update global event summary
  const globalRef = doc(db, "events", eventId);
  await updateDoc(globalRef, {
    ...("title" in updates ? { title: updates.title } : {}),
    ...("description" in updates ? { description: updates.description } : {}),
    ...("date" in updates ? { date: updates.date } : {}),
    ...(bannerUrl ? { bannerUrl } : {}),
  });
};

// Delete event
export const deleteEvent = async (userId: string, eventId: string) => {
  const eventRef = doc(db, "users", userId, "events", eventId);
  await deleteDoc(eventRef);

  const globalRef = doc(db, "events", eventId);
  await deleteDoc(globalRef);
};
