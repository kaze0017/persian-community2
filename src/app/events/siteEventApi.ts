// src/app/client/siteEvents/siteEventsApi.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types/event";

/**
 * Fetch the summary event from 'events/[eventId]'
 */
export const getEventSummary = async (eventId: string): Promise<{ clientId: string }> => {
  const summaryRef = doc(db, "events", eventId);
  const summarySnap = await getDoc(summaryRef);

  if (!summarySnap.exists()) {
    throw new Error("Event summary not found");
  }

  const data = summarySnap.data();
  if (!data.clientId) throw new Error("Missing clientId in event summary");

  return { clientId: data.clientId };
};

/**
 * Fetch the full event from 'users/[clientId]/events/[eventId]'
 */
export const getFullEvent = async (clientId: string, eventId: string): Promise<Event> => {
  const fullRef = doc(db, "users", clientId, "events", eventId);
  const fullSnap = await getDoc(fullRef);

  if (!fullSnap.exists()) throw new Error("Full event not found");

  return { id: fullSnap.id, ...fullSnap.data() } as Event;
};

/**
 * Fetch full event using eventId (summary -> full)
 */
export const fetchFullEventById = async (eventId: string): Promise<Event> => {
  const { clientId } = await getEventSummary(eventId);
  return await getFullEvent(clientId, eventId);
};
