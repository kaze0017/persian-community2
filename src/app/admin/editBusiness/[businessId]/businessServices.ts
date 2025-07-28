import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/services/storageService';
import { Business } from '@/types/business';

export const getBusinessById = async (id: string) => {
  const ref = doc(db, 'businesses', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Business;
};

export const updateBusiness = async (
  id: string,
  data: Partial<Business>,
  files: {
    logoFile?: File | null;
    ownerImageFile?: File | null;
    businessCardFile?: File | null;
    bannerImageFile?: File | null;
  }
) => {
  const businessId = id;

  const imageFiles = [
    {
      key: 'ownerImageUrl',
      file: files.ownerImageFile,
      path: 'owner',
      name: 'profile.jpg',
      optName: 'profile.webp',
    },
    {
      key: 'businessCardUrl',
      file: files.businessCardFile,
      path: 'card',
      name: 'card.jpg',
      optName: 'card.webp',
    },
    {
      key: 'logoUrl',
      file: files.logoFile,
      path: 'logo',
      name: 'logo.jpg',
      optName: 'logo.webp',
    },
    {
      key: 'bannerImageUrl',
      file: files.bannerImageFile,
      path: 'banner',
      name: 'banner.jpg',
      optName: 'banner.webp',
    },
  ];

  const urls: Record<string, string | null> = {};

  for (const { key, file, path, name, optName } of imageFiles) {
    urls[key] = file
      ? (
          await uploadImage(file, `businesses/${businessId}/${path}`, name)
        ).replace(name, optName)
      : null;
  }
  await updateDoc(doc(db, 'businesses', businessId), urls);
};
