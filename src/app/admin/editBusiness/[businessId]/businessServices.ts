import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/services/storageService';
import { Business } from '@/types/business';
import { Banner } from '@/types/banner';
import { serverTimestamp } from "firebase/firestore";


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
      key: 'bannerImageUrls',
      file: files.bannerImageFile,
      path: 'banner',
      name: 'banner.jpg',
      optName: 'banner.webp',
    },
  ];

  const urls: Record<string, string | Banner> = {};

  for (const { key, file, path, name, optName } of imageFiles) {
    if (!file) continue; // ✅ skip if no new file

    if (key === 'bannerImageUrls') {
      const originalUrl = await uploadImage(file, `businesses/${businessId}/${path}`, name);

      const bannerUrls: Banner = {
        original: originalUrl.replace(name, optName),
        sizes: {
          small: originalUrl.replace(name, 'banner_small.webp'),
          medium: originalUrl.replace(name, 'banner_medium.webp'),
          large: originalUrl.replace(name, 'banner_large.webp'),
          xlarge: originalUrl.replace(name, 'banner_xlarge.webp'),
        },
      };

      urls[key] = bannerUrls;
    } else {
      urls[key] = (
        await uploadImage(file, `businesses/${businessId}/${path}`, name)
      ).replace(name, optName);
    }
  }

  // ✅ Merge new data & URLs
  await updateDoc(doc(db, 'businesses', businessId), {
    ...data,
    ...urls,
  });
};
