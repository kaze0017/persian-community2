import { Timestamp } from 'firebase/firestore';
import { Business } from './business';
import { Occasion } from './occasions';

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string; 
  time: string; 
  location: string; 
  category: string;
  occasion?: Occasion;
  address: string; 
  coordinates: {
    lat: number;
    lng: number;
  };
  bannerUrl?: string;
  sponsors?: Business[];
  organizers?: {
    id?: string;
    name: string;
    contact: string;
    imageUrl?: string;
  }[];

  tags?: string[];
  isPublic?: boolean;
  // createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  days?: EventDay[];  
  isFeatured?: boolean;
};

export type EventDay = {
  date: string;      
  blocks: EventBlock[];
};

export type EventBlock = {
  start: string;
  end: string;  
  title: string; 
  description?: string;
  activities: string[] | string;
  iconName?: string; 
};