import { doc, setDoc, collection, type DocumentData } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { db } from '@/lib/firebase';



export async function createDocument<T extends DocumentData>(
  path: string,
  data: T
): Promise<string> {
  const collRef = collection(db, path);
  const newDocRef = doc(collRef);
  await setDoc(newDocRef, data); 
  return newDocRef.id;
}


export async function deleteImageByUrl(downloadUrl: string): Promise<void> {
  const storage = getStorage();

  try {
    const decodedUrl = decodeURIComponent(downloadUrl);
    const matches = decodedUrl.match(/\/o\/(.+)\?/);

    if (!matches || matches.length < 2) {
      throw new Error('Invalid Firebase Storage URL');
    }

    const filePath = matches[1]; // Extract the path after `/o/` and before `?`
    const fileRef = ref(storage, filePath);

    await deleteObject(fileRef);
  } catch (error) {
    console.error('Failed to delete image:', error);
    throw error;
  }
}

