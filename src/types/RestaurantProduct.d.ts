import { Timestamp, FieldValue } from "firebase/firestore";

export type RestaurantProduct = {
  id?: string;
  fsId?: string;
  name: string;
  description?: string;
  price?: number;
  featured?: boolean;
  imageUrl?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  options?: string;
  type?: string; 
  category?: string; 
};
export type Category = {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  items?: RestaurantProduct[] | undefined; // Optional items array
}

