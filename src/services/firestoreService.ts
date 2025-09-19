import { db  } from '@/lib/firebase'; // Adjust the import path as necessary
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  type FieldValue,
} from 'firebase/firestore';
import { Business, BusinessReward } from '@/types/business';
import { Event } from '@/types/event';
import { Category } from '@/types/category';

type FirestorePath =
  | Business
  | Event
  | Category
  | BusinessReward
  | BusinessReward[];

export const createDocument = async <T extends { id?: string }>(
  path: string,
  data: Omit<T, 'id'> // data without the id field
): Promise<string> => {
  const docRef = await addDoc(collection(db, path), data);
  return docRef.id;
};
export const getDocument = async (path: string, id: string) => {
  const snapshot = await getDoc(doc(db, path, id));
  return snapshot.exists() ? snapshot.data() : null;
};

export const updateDocument = async <T>(
  path: string,
  id: string,
  data: Partial<T>
) => {
  return await updateDoc(doc(db, path, id), data);
};

export const deleteDocument = async (path: string, id: string) => {
  return await deleteDoc(doc(db, path, id));
};

export const getCollection = async <T>(
  path: string
): Promise<(T & { id: string })[]> => {
  const snapshot = await getDocs(collection(db, path));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }));
};

export const getDocumentData = async <T>(path: string): Promise<T | null> => {
  const [collectionName, docId, ...rest] = path.split('/');
  if (!docId || rest.length > 0) throw new Error('Invalid document path');

  const docRef = doc(db, collectionName, docId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? (snapshot.data() as T) : null;
};

export type FirestoreUpdateData = {
  [key: string]:
    | FieldValue
    | Partial<FirestoreUpdateData>
    | string
    | number
    | boolean
    | null
    | FirestorePath
    | undefined;
};

export const updateDocument2 = async (
  path: string,
  id: string,
  data: FirestoreUpdateData
) => {
  const docRef = doc(db, path, id);
  return await updateDoc(docRef, data);
};

import { setDoc } from 'firebase/firestore';

export async function createDocumentWithId<T extends Record<string, any>>(
  collectionPath: string,
  data: T
) {
  const newDocRef = doc(collection(db, collectionPath));
  await setDoc(newDocRef, data);
  return newDocRef.id;
}

export const getSubCollection = async <T>(
  parentPath: string, // e.g. "businesses/abc123"
  subCollectionName: string // e.g. "rewards"
): Promise<(T & { id: string })[]> => {
  const subColRef = collection(db, `${parentPath}/${subCollectionName}`);
  const snapshot = await getDocs(subColRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }));
};
