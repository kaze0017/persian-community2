// src/firebase/descriptionApi.ts
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';

type AboutConfig = {
  placeId?: string;
  isEnabled?: boolean;
};

// Fetch Google Place ID
export const fetchGoogleId = async (businessId: string): Promise<string | null> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    const snapshot = await getDoc(businessRef);
    if (!snapshot.exists()) return null;

    const googleReviewsConfig: AboutConfig = snapshot.data()?.businessConfig?.googleReviewsConfig || {};
    return googleReviewsConfig.placeId || null;
  } catch (error) {
    console.error('Error fetching Google Place ID:', error);
    throw error;
  }
};

// Add or update Google Place ID
export const setGoogleId = async (businessId: string, googlePlaceId: string): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      'businessConfig.googleReviewsConfig.placeId': googlePlaceId,
    });
  } catch (error) {
    console.error('Error setting Google Place ID:', error);
    throw error;
  }
};

// Delete Google Place ID
export const deleteGoogleId = async (businessId: string): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      'businessConfig.googleReviewsConfig.placeId': deleteField(),
    });
  } catch (error) {
    console.error('Error deleting Google Place ID:', error);
    throw error;
  }
};
