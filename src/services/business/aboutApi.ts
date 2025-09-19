// src/firebase/descriptionApi.ts
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';

type AboutConfig = {
  description?: string;
  // you can add more fields like owner, images, etc.
};

// Fetch description
export const fetchDescription = async (businessId: string): Promise<string | null> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    const snapshot = await getDoc(businessRef);
    if (!snapshot.exists()) return null;

    const aboutConfig: AboutConfig = snapshot.data()?.businessConfig?.aboutConfig || {};
    return aboutConfig.description || null;
  } catch (error) {
    console.error('Error fetching description:', error);
    throw error;
  }
};

// Add or update description
export const setDescription = async (businessId: string, description: string): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      'businessConfig.aboutConfig.description': description,
    });
  } catch (error) {
    console.error('Error setting description:', error);
    throw error;
  }
};

// Delete description
export const deleteDescription = async (businessId: string): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      'businessConfig.aboutConfig.description': deleteField(),
    });
  } catch (error) {
    console.error('Error deleting description:', error);
    throw error;
  }
};
