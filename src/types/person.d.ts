export interface Person {
  id: string;
  name: string;
  bio?: string;
  photoUrl?: string;
  linkedInUrl?: string;
  linkedInId?: string; // LinkedIn unique id, if OAuth connected
  email?: string;      // To send connection request/invitation
  connectedWithLinkedIn?: boolean; // true if OAuth done
  createdAt?: string;
  updatedAt?: string;
}
