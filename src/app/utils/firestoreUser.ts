import { doc, setDoc, getDoc  } from 'firebase/firestore';
import { db } from '@/lib/firebase';


interface FirestoreUserData {
  themeMode?: 'light' | 'dark' | 'system';
  role?: string;
  // Add more fields here as needed in the future
}

export async function updateUserTheme(
  uid: string,
  themeMode: 'dark' | 'light' | 'system'
) {
  if (!uid) return;

  const userDocRef = doc(db, 'users', uid);

  try {
    await setDoc(userDocRef, { themeMode }, { merge: true });
  } catch (error) {
    console.error('Failed to update user theme:', error);
    throw error; 
  }
}

export async function getUserSettings(uid: string): Promise<{
  themeMode: 'light' | 'dark' | 'system' | null;
  role: string | null;
}> {
  if (!uid) return { themeMode: null, role: null };

  const userDocRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userDocRef);

  if (!docSnap.exists()) {
    return { themeMode: null, role: null };
  }

  const data = docSnap.data() as FirestoreUserData;

  return {
    themeMode:
      data.themeMode && ['light', 'dark', 'system'].includes(data.themeMode)
        ? data.themeMode
        : null,
    role: typeof data.role === 'string' ? data.role : null,
  };
}

// export async function getUserTheme(uid: string): Promise<'light' | 'dark' | 'system' | null> {
//     if (!uid) return null;
  
//     const userDocRef = doc(db, 'users', uid);
//     const docSnap = await getDoc(userDocRef);
  
//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       if (data.themeMode && ['light', 'dark', 'system'].includes(data.themeMode)) {
//         return data.themeMode;
//       }
//     }
//     return null;
//   }

//   export async function getUserRole(uid: string): Promise<string | null> {
//     if (!uid) return null;
  
//     const userDocRef = doc(db, 'users', uid);
//     const docSnap = await getDoc(userDocRef);
  
//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       if (data.role && typeof data.role === 'string') {
//         return data.role;
//       }
//     }
//     return null;
//   }

  