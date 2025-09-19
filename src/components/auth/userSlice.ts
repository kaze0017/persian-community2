import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';

interface UserState {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  loading: boolean;
  error: string | null;
  role: string | null;
  themeMode: 'light' | 'dark' | 'system';
  businesses: string[] | null;
  workshops: string[] | null;
  events: string[] | null;
}

const initialState: UserState = {
  uid: null,
  email: null,
  displayName: null,
  photoURL: null,
  loading: false,
  error: null,
  role: null,
  themeMode: 'light',
  businesses: [],
  workshops: [],
  events: [],
};

/// Async thunk for login
export const login = createAsyncThunk(
  'user/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,

      };
    } catch (error) {
      const err = error as FirebaseError;
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk for signup
export const signup = createAsyncThunk(
  'user/signup',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        businesses: [],
        workshops: [],
        events: [],
      };
    } catch (error) {
      const err = error as FirebaseError;
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk for Google login
export const loginWithGoogle = createAsyncThunk(
  'user/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      const err = error as FirebaseError;
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      return;
    } catch (error) {
      const err = error as FirebaseError;
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoURL = null;
      state.error = null;
      state.loading = false;
      state.role = null;
      state.themeMode = 'light'; 
      state.businesses = null;
      state.workshops = null;
      state.events = null;
    },
    clearError(state) {
      state.error = null;
    },
    setUserFromFirebase(state, action) {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
      state.role = action.payload.role || null;
      state.themeMode = action.payload.themeMode || 'light'; 
      state.loading = false;
      state.error = null;
      state.businesses = action.payload.businesses || [];
      state.workshops = action.payload.workshops || [];
      state.events = action.payload.events || [];
    },
    setThemeMode(state, action) {
      state.themeMode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.displayName = action.payload.displayName;
        state.photoURL = action.payload.photoURL;
 
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.displayName = action.payload.displayName;
        state.photoURL = action.payload.photoURL;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // loginWithGoogle
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.uid = action.payload.uid;
        state.email = action.payload.email;
        state.displayName = action.payload.displayName;
        state.photoURL = action.payload.photoURL;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.uid = null;
        state.email = null;
        state.displayName = null;
        state.photoURL = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { clearUser, clearError, setUserFromFirebase, setThemeMode } = userSlice.actions;
export default userSlice.reducer;
