import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/lib/firebase'; // Adjust the import path as necessary

export const uploadImage = async (
  file: File,
  path: string,
  fileName?: string
): Promise<string> => {
  try {
    const newName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName || newName}`);
    const snapshot = await uploadBytes(storageRef, file);

    if (!snapshot.metadata) {
      throw new Error('Upload succeeded but metadata is missing');
    }

    console.log('✅ File uploaded successfully:', snapshot.metadata.fullPath);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (err) {
    console.error('❌ Upload failed:', err);
    throw err;
  }
};

export async function uploadFiles(pathsAndFiles: { path: string, file: File }[]) {
  const urls = await Promise.all(
    pathsAndFiles.map(async ({ path, file }) => {
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    })
  );

  return urls;
}
