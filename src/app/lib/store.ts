'use client';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/components/auth/userSlice';
import businessesReducer from './businessesSlice';
import categoriesReducer from './categoriesSlice';
import eventReducer from '@/app/admin/events/reducer/eventsSlice';
import tagsReducer from './tagsSlice';
import occasionReducer from './occasionsSlice';
import productsReducer from './productsSlice';
import productsRestaurantReducer from './restaurantProductSlice';
import tablesReducer from '@/app/admin/salon/salonSlice';
import peopleReducer from '@/app/admin/people/peopleSlice';
import workshopsReducer from '@/app/admin/workshops/workshopSlice';
import clientBusinessReducer from '@/app/client/clientReducer/clientBusinessReducer';
import clientEventsReducer from '@/app/client/clientReducer/clientEventsReducer';



export const store = configureStore({
  reducer: {
    user: userReducer,
    businesses: businessesReducer,
    categories: categoriesReducer,
    events: eventReducer,
    tags: tagsReducer,
    occasions: occasionReducer,
    products: productsReducer,
    restaurantProducts: productsRestaurantReducer,
    tables: tablesReducer,
    people: peopleReducer,
    workshops: workshopsReducer,
    clientBusiness: clientBusinessReducer,
    clientEvents: clientEventsReducer,
  }
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
