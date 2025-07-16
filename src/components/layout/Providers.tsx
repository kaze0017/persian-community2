'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/app/lib/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setUserFromFirebase } from '@/components/auth/userSlice';
// import { getUserRole } from '@/app/utils/firestoreUser'; // adjust the path as needed
import { getUserSettings } from '@/app/utils/firestoreUser'; // adjust the path as needed

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthListener>{children}</AuthListener>
    </Provider>
  );
}

function AuthListener({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { role, themeMode } = await getUserSettings(user.uid); // ✅ Fetch role from Firestore

        dispatch(
          setUserFromFirebase({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: role || null,
            themeMode: themeMode || 'light',
          })
        );
      } else {
        dispatch(
          setUserFromFirebase({
            uid: null,
            email: null,
            displayName: null,
            photoURL: null,
            role: null,
            themeMode: 'light',
          })
        );
      }
      setLoading(false); // auth state determined, stop loading
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    // Return null or a loading spinner/splash screen here to avoid hydration mismatch
    return null;
  }

  // Render children only when auth state is known
  return <>{children}</>;
}
