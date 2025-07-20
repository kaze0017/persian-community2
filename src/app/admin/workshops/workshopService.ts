// src/services/workshopService.ts
import { WorkshopFormValues } from '@/app/lib/validators/workshop';
import { uploadImage } from '@/services/storageService';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { updateWorkshop } from '@/app/admin/workshops/workshopSlice';
import { useAppDispatch } from '@/app/hooks';

export async function saveWorkshop(
  dispatch: ReturnType<typeof useAppDispatch>,
  data: WorkshopFormValues,
  bannerFile?: File | null,
  selectedWorkshopId?: string,
  existingBannerUrl?: string
) {
  let workshopId: string;
  let bannerUrl = existingBannerUrl || '';

  const sanitizedData = {
    ...data,
    price: data.price ? Number(data.price) : 0,
    bannerUrl,
    instructor: {
      ...data.instructor,
      id: data.instructor?.id ?? '',
      name: data.instructor?.name ?? '',
      bio: data.instructor?.bio ?? '',
      photoUrl: data.instructor?.photoUrl ?? '',
      linkedInUrl: data.instructor?.linkedInUrl ?? '',
      linkedInId: data.instructor?.linkedInId ?? '',
      email: data.instructor?.email ?? '',
      connectedWithLinkedIn: data.instructor?.connectedWithLinkedIn ?? false,
      createdAt: data.instructor?.createdAt ?? '',
      updatedAt: data.instructor?.updatedAt ?? '',
    },
  };

  if (selectedWorkshopId) {
    workshopId = selectedWorkshopId;

    await dispatch(
      updateWorkshop({
        id: workshopId,
        data: sanitizedData,
      })
    ).unwrap();
  } else {
    const workshopDocRef = doc(collection(db, 'workshops'));
    workshopId = workshopDocRef.id;

    if (bannerFile) {
      bannerUrl = await uploadImage(
        bannerFile,
        `workshops/${workshopId}/banner`
      );
    }

    await setDoc(workshopDocRef, {
      ...sanitizedData,
      bannerUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  if (selectedWorkshopId && bannerFile) {
    bannerUrl = await uploadImage(bannerFile, `workshops/${workshopId}/banner`);
    await dispatch(
      updateWorkshop({ id: workshopId, data: { bannerUrl } })
    ).unwrap();
  }
}
