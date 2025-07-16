import type { Timestamp } from 'firebase/firestore';

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
  createdAt?: Timestamp
  type?: string; 
  category?: string; 
};

// Drink: Juice, Soda, etc.
// export type Drink = BaseProduct & {
//   type: 'drink';
//   category?: 'soft drink' | 'juice' | 'alcoholic' | string;
// };

// // Meal: Main dishes
// export type Meal = BaseProduct & {
//   type: 'meal';
//   category?: 'breakfast' | 'lunch' | 'dinner' | 'main course' | string;
// };

// // Snack: Chips, Nuts
// export type Snack = BaseProduct & {
//   type: 'snack';
//   category?: 'chips' | 'nuts' | 'candy' | string;
// };

// // Dessert: Sweet dishes
// export type Dessert = BaseProduct & {
//   type: 'dessert';
//   category?: 'cake' | 'ice cream' | 'pastry' | string;
// };

// // 🍽️ Combined Union Type
// export type RestaurantProduct = Drink | Meal | Snack | Dessert;
