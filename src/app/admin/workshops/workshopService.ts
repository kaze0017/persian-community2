import { Firestore, serverTimestamp } from 'firebase/firestore';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useAppDispatch } from '@/app/hooks';
import { uploadImage } from '@/services/storageService';
import { WorkshopFormValues } from '@/app/lib/validators/workshop';
import { updateWorkshop } from './workshopSlice';
import { db } from '@/lib/firebase';
import { collection } from 'firebase/firestore';


export async function saveWorkshop(
  dispatch: ReturnType<typeof useAppDispatch>,
  data: WorkshopFormValues,
  bannerFile?: File | null,
  selectedWorkshopId?: string,
  existingBannerUrl?: string
) {
  const workshopId = selectedWorkshopId ?? doc(collection(db, 'workshops')).id;
let bannerUrl = existingBannerUrl || '';
console.log('**:', workshopId, existingBannerUrl);

if (bannerFile) {
  const uploadedUrl = await uploadImage(
    bannerFile,
    `workshops/${workshopId}/banner`,
    `banner.jpg`
  );

  console.log('**Uploaded banner URL:', workshopId, uploadedUrl);

  // Replace .jpg or .jpeg (case insensitive) with .webp in the URL
bannerUrl = uploadedUrl.replace('banner.jpg', 'banner.webp');
}

console.log('**Final banner URL:', workshopId, bannerUrl);


  const { bannerFile: _discard, ...dataWithoutBannerFile } = data as any;

  // Prepare Firestore data (with serverTimestamp)
  const firestoreData = {
    ...dataWithoutBannerFile,
    price: Number(data.price) || 0,
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
    updatedAt: serverTimestamp(),  // Firestore timestamp
  };

  // Prepare Redux data (with serializable updatedAt as ISO string)
  const reduxData = {
    ...dataWithoutBannerFile,
    price: Number(data.price) || 0,
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
    updatedAt: new Date().toISOString(),  // serializable string
  };

  if (selectedWorkshopId) {
    // Update Firestore with serverTimestamp
    const docRef = doc(db, 'workshops', workshopId);
    console.log('Updating workshop:', workshopId, firestoreData);
    await updateDoc(docRef, firestoreData);

    // Update Redux with serializable data
    await dispatch(
      updateWorkshop({
        id: workshopId,
        data: reduxData,
      })
    ).unwrap();
  } else {
    // Create new Firestore document
    const workshopDocRef = doc(db, 'workshops', workshopId);
    await setDoc(workshopDocRef, {
      ...firestoreData,
      createdAt: serverTimestamp(),
    });

    // Update Redux with serializable data
    await dispatch(
      updateWorkshop({
        id: workshopId,
        data: reduxData,
      })
    ).unwrap();
  }
}

