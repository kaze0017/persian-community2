// src/app/admin/events/hooks/usePreviousEvents.ts
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Event } from "@/types/event";

export function usePreviousEvents(clientId: string) {
  const [previousEvents, setPreviousEvents] = useState<Partial<Event>[]>([]);

  useEffect(() => {
    if (!clientId) return;
    const fetchPreviousEvents = async () => {
      const q = query(collection(db, "events"), where("clientId", "==", clientId), limit(3));
      const querySnapshot = await getDocs(q);
      setPreviousEvents(querySnapshot.docs.map((doc) => doc.data() as Partial<Event>));
    };
    fetchPreviousEvents();
  }, [clientId]);

  return previousEvents;
}
