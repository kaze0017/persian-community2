import { Person } from "./person";
import { Timestamp, FieldValue } from "firebase/firestore";


export type WorkshopCategory = 'Language' | 'Career' | 'Tech' | 'Health' | 'Other';

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimeRange {
  start: string;      // e.g. "10:00"
  end: string;        // e.g. "11:00"
  location?: string;  // optional location per time range
}

export interface DaySchedule {
  day: Weekday;
  timeRanges: TimeRange[];
}

export interface Workshop {
  id: string;
  title: string;
  description?: string;
  category: WorkshopCategory;
  startDate: string;
  endDate: string;
  sameHoursForAllDays: boolean; 
  sharedTimeRanges?: TimeRange[]; 
  schedule: DaySchedule[];
  instructor: Person;
  price: number;
  language?: 'English' | 'French' | 'Farsi' | 'Other';
  bannerUrl?: string;
  capacity?: number;
}
