import { Timestamp, FieldValue } from 'firebase/firestore';
import { Business } from './business';
import { Occasion } from './occasions';

export type LatLng = {
  lat: number;
  lng: number;
};

export type MarkerData = {
  id: string;
  eventId: string; // Optional eventId to associate marker with an event
  position: LatLng;
  title: string;
  description: string;
  imageUrls: string[];
  isPinned: boolean;
};

export type Event = {
  id: string;
  clientId: string;
  title: string;
  description: string;
  date: string | Timestamp;
  time: string;
  location: string;
  category: string;
  occasion?: Occasion;
  address: string;
  coordinates?: LatLng; // Event's primary location
  path?: LatLng[]; // Hiking trail path
  markers?: MarkerData[]; // Markers along the path
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
  eventLayoutUrl?: string;
  eventConfig?: {
    scheduleConfig?: {
      isEnabled?: boolean;
    };
    contactConfig?: {
      isEnabled?: boolean;
    };
    organizersConfig?: {
      isEnabled?: boolean;
    };
    sponsorsConfig?: {
      isEnabled?: boolean;
    };
    layoutConfig?: {
      isEnabled?: boolean;
    };
    tagsConfig?: {
      isEnabled?: boolean;
    };
    ticketsConfig?: {
      isEnabled?: boolean;
    };
  };
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  path?: LatLng[];
  markers?: MarkerData[];
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


export interface MarkerData {
  id: string;
  position: LatLng;
  title: string;
  description: string;
  imageUrls: string[];
  isPinned: boolean;
}


export interface HikeMapData {
  eventId: string;
  path: LatLng[];
  markers: MarkerData[];
}