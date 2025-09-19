import { Timestamp, FieldValue } from "firebase/firestore";

export interface Person {
  id: string;
  name: string;
  bio?: string;
  photoUrl?: string;
  linkedInUrl?: string;
  linkedInId?: string; 
  email?: string;    
  connectedWithLinkedIn?: boolean; 
  businesses?: string[];
  events?: string[];
  workshops?: string[];
}
