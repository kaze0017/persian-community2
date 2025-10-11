// // src/app/admin/events/hooks/useAIEventGenerator.ts
// import { UseFormReturn } from "react-hook-form";
// import { Event } from "@/types/event";

// export function useAIEventGenerator<T extends Omit<Event, "id">>(
//   methods: UseFormReturn<T>,
//   previousEvents: Partial<Event>[],
//   imageText: string
// ) {
//   const setValue = methods.setValue;

//   const mapResponseToForm = (aiEvent: any) => {
//     let { date, time } = aiEvent;
//     if (date && date.includes("T") && !time) {
//       const dateTime = new Date(date);
//       date = dateTime.toISOString().split("T")[0];
//       time = dateTime.toISOString().split("T")[1].slice(0, 5);
//     }

//     setValue("title", aiEvent.title || "");
//     setValue("description", aiEvent.description || "");
//     setValue("date", date || "");
//     setValue("time", time || "");
//     setValue("location", aiEvent.location || "");
//     setValue("category", aiEvent.category || "General");
//     setValue("address", aiEvent.address || "");
//     setValue("coordinates.lat", aiEvent.coordinates?.lat || 0);
//     setValue("coordinates.lng", aiEvent.coordinates?.lng || 0);
//     setValue("tags", aiEvent.tags || []);
//     setValue("sponsors", aiEvent.sponsors || []);
//     setValue(
//       "organizers",
//       aiEvent.organizers ||
//         (aiEvent.organizer
//           ? [{ name: aiEvent.organizer.name || "", contact: aiEvent.organizer.contact || "" }]
//           : [])
//     );
//     setValue("isPublic", aiEvent.isPublic ?? true);
//     setValue("isOnline", aiEvent.isOnline ?? false);
//     setValue("days", aiEvent.days || []);
//     setValue("isFeatured", aiEvent.isFeatured ?? false);
//     setValue("eventLayoutUrl", aiEvent.eventLayoutUrl || undefined);
//     setValue("eventConfig", aiEvent.eventConfig || {});
//   };

//   const generate = async (section: keyof T | "all", endpoint: string) => {
//     const currentValues = methods.getValues();
//     const res = await fetch(endpoint, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...currentValues, section, previousEvents, imageText }),
//     });
//     if (!res.ok) throw new Error("AI request failed");

//     const data = await res.json();
//     mapResponseToForm(data);
//     return data;
//   };

//   return {
//     generateAI: (section: keyof T | "all") => generate(section, "/api/generate-event"),
//     generateVertexAI: (section: keyof T | "all") => generate(section, "/api/generate-vertex-event"),
//   };
// }
