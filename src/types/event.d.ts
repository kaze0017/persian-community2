import { Timestamp, FieldValue } from 'firebase/firestore';
import { Business } from './business';
import { Occasion } from './occasions';
import { Banner } from './banner';

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
  bannerUrls?: Banner;
  sponsors?: Business[];
  ownerImageUrl?: string;
  organizers?: {
    id?: string;
    name: string;
    contact: string;
    imageUrl?: string;
  }[];

  tags?: string[];
  isPublic?: boolean;
  isOnline?: boolean;
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