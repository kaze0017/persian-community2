// src/firebase/servicesApi.ts
import { db } from '@/lib/firebase'; // adjust import to your firebase config
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { storage } from '@/lib/firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';

import { BusinessService } from '@/types/business';
import { uploadImage } from '../storageService';

// Fetch all services for a business
export const fetchServices = async (
  businessId: string
): Promise<BusinessService[]> => {
  console.log('Fetching services for business:', businessId);
  try {
    const servicesRef = collection(db, 'businesses', businessId, 'services');
    const q = query(servicesRef);
    const snapshot = await getDocs(q);
    console.log(
      'Fetched services:',
      snapshot.docs.map((doc) => doc.data())
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BusinessService[];
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Add a new service

export const addService = async (
  businessId: string,
  service: Omit<BusinessService, 'id'>
): Promise<BusinessService> => {
  console.log('Adding service to business:', businessId, service);
  // Generate an ID first
  const serviceRef = doc(collection(db, 'businesses', businessId, 'services'));

  let iconUrl = '';
  if ((service as any).file) {
    console.log(
      'Uploading image for service...',
      `businesses/${businessId}/services/${serviceRef.id}/icon`
    );
    iconUrl = await uploadImage(
      (service as any).file,
      `businesses/${businessId}/services/${serviceRef.id}/icon`,
      'icon.jpg'
    );
  }

  // Remove the `file` before saving
  const { file, ...serviceData } = service as any;

  const newService: BusinessService = {
    ...serviceData,
    id: serviceRef.id,
    iconUrl, // store the download URL if uploaded
  };

  await setDoc(serviceRef, newService);

  return newService;
};

// Update a service
export const updateService = async (
  businessId: string,
  serviceId: string,
  data: Partial<BusinessService>
): Promise<BusinessService> => {
  console.log('Updating service:', businessId, serviceId, data);
  const serviceRef = doc(db, 'businesses', businessId, 'services', serviceId);

  let updateData: any = { name: data.name, description: data.description };
  if (data.file) {
    await deleteFolder(`businesses/${businessId}/services/${serviceId}`);
    let iconUrl = await uploadImage(
      data.file,
      `businesses/${businessId}/services/${serviceId}/icon`,
      'icon.jpg'
    )
    // replace icon.jpg to icon_thumb.jpg 
    iconUrl = iconUrl.replace('icon.jpg', 'icon_thumb.webp');
    updateData = { name: data.name, description: data.description, iconUrl };
  }

  await updateDoc(serviceRef, updateData);

  // fetch and return updated service
  const updatedDoc = await getDoc(serviceRef);
return { ...(updatedDoc.data() as BusinessService), id: updatedDoc.id };
};

// Delete a service (and its folder)
export const deleteService = async (businessId: string, serviceId: string) => {
  const serviceRef = doc(db, 'businesses', businessId, 'services', serviceId);

  // Delete Firestore doc
  await deleteDoc(serviceRef);

  // Delete associated storage folder
  await deleteFolder(`businesses/${businessId}/services/${serviceId}`);
};

const deleteFolder = async (path: string) => {
  const folderRef = ref(storage, path);
  const list = await listAll(folderRef);

  // delete all files in this folder
  await Promise.all(list.items.map((item) => deleteObject(item)));

  // delete subfolders too
  await Promise.all(
    list.prefixes.map((subfolder) => deleteFolder(subfolder.fullPath))
  );
};
