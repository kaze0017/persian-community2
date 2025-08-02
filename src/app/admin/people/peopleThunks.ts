// peopleThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Person } from '@/types/person'; 
import { uploadImage } from '@/services/storageService'; 
import { getCollection, updateDocument } from '@/services/firestoreService'; 
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';


export const fetchPeople = createAsyncThunk<Person[]>(
  'people/fetchPeople',
  async () => getCollection<Person>('people')
);

export const createPerson = createAsyncThunk<
  Person,
  { personData: Omit<Person, 'id' | 'photoUrl'>; file?: File }
>(
  'people/createPerson',
  async ({ personData, file }) => {
    const personRef = doc(collection(db, 'people'));
    const id = personRef.id;

    let photoUrl: string | undefined;
    if (file) {
      photoUrl = (await uploadImage(file, `people/${id}`, `profile.jpg`)).replace('profile.jpg', 'profile.webp');
    }

    const now = new Date().toISOString();
    const newPersonData: Person = {
      id,
      ...personData,
      photoUrl,
    };

    await setDoc(personRef, newPersonData);
    return newPersonData;
  }
);

export const editPerson = createAsyncThunk<
  Partial<Person> & { id: string },
  { id: string; updates: Partial<Omit<Person, 'id' >>; file?: File }
>(
  'people/editPerson',
  async ({ id, updates, file }) => {
    let photoUrl: string | undefined;

    if (file) {
      photoUrl = await uploadImage(file, `people/${id}`);
    }

    const updatesWithMeta: Partial<Person> = {
      ...updates,
      ...(photoUrl ? { photoUrl } : {})
    };

    await updateDocument<Person>('people', id, updatesWithMeta);

    return { id, ...updatesWithMeta };
  }
);
