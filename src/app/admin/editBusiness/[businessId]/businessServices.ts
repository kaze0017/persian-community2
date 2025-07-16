import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/services/storageService';

export const getBusinessById = async (id: string) => {
  const ref = doc(db, 'businesses', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as any;
};

export const updateBusiness = async (
  id: string,
  data: any,
  files: {
    logoFile?: File | null;
    ownerImageFile?: File | null;
    businessCardFile?: File | null;
  }
) => {
  const updateData: any = { ...data };

  if (files.logoFile) {
    updateData.logoUrl = await uploadImage(files.logoFile, `logos/${id}`);
  }
  if (files.ownerImageFile) {
    updateData.ownerImageUrl = await uploadImage(files.ownerImageFile, `owners/${id}`);
  }
  if (files.businessCardFile) {
    updateData.businessCardUrl = await uploadImage(files.businessCardFile, `cards/${id}`);
  }

  await updateDoc(doc(db, 'businesses', id), updateData);
};
