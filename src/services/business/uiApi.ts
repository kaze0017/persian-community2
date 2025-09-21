// src/services/business/uiApi.ts
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * Toggle About Section
 */
export const setAboutEnabled = async (businessId: string, isEnabled: boolean): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      'businessConfig.aboutConfig.isEnabled': isEnabled,
    });
  } catch (error) {
    console.error('Error updating About section status:', error);
    throw error;
  }
};

/**
 * Toggle Google Reviews Section
 */
export const setGoogleReviewsEnabled = async (businessId: string, isEnabled: boolean): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      'businessConfig.googleReviewsConfig.isEnabled': isEnabled,
    });
  } catch (error) {
    console.error('Error updating Google Reviews status:', error);
    throw error;
  }
};

/**
 * Toggle Services Section
 */
export const setServicesEnabled = async (businessId: string, isEnabled: boolean): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      'businessConfig.servicesConfig.isEnabled': isEnabled,
    });
  } catch (error) {
    console.error('Error updating Services section status:', error);
    throw error;
  }
};

/**
 * Toggle Contact Section
 */
export const setContactEnabled = async (businessId: string, isEnabled: boolean): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      'businessConfig.contactConfig.isEnabled': isEnabled,
    });
  } catch (error) {
    console.error('Error updating Contact section status:', error);
    throw error;
  }
};
