import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { BusinessContactConfig } from '@/types/business';
export const setContacts = async (businessId: string, contacts: BusinessContactConfig): Promise<void> => {
  try {
    const businessRef = doc(db, 'businesses', businessId);
    await updateDoc(businessRef, {
      'businessConfig.contactConfig': contacts,
    });
  } catch (error) {
    console.error('Error setting contacts:', error);
    throw error;
  }
};