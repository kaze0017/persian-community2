import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // adjust import path
import { Workshop } from '@/types/workshop';
import { Timestamp } from 'firebase/firestore';

type FirestoreWorkshopData = Omit<Workshop, 'id' | 'createdAt' | 'updatedAt'> & {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
interface WorkshopsState {
  workshops: Workshop[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkshopsState = {
  workshops: [],
  loading: false,
  error: null,
};

// Async thunk: fetch all workshops
export const fetchWorkshops = createAsyncThunk<
  Workshop[],         // Return type
  void,               // Argument type
  { rejectValue: string } // thunkAPI.rejectWithValue type
>(
  'workshops/fetchAll',
  async (_, thunkAPI) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'workshops'));
      const workshops: Workshop[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirestoreWorkshopData;
         workshops.push({
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate().toISOString() ?? '',
    updatedAt: data.updatedAt?.toDate().toISOString() ?? '',
  });
      });

      return workshops;
    } catch (error: unknown) {
      let message = 'Unknown error';

      if (error instanceof Error) {
        message = error.message;
      }

      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Async thunk: add new workshop
export const addWorkshop = createAsyncThunk(
  'workshops/add',
  async (newWorkshop: Omit<Workshop, 'id'>, thunkAPI) => {
    try {
      const docRef = await addDoc(collection(db, 'workshops'), newWorkshop);
      return { id: docRef.id, ...newWorkshop };
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk: update existing workshop
export const updateWorkshop = createAsyncThunk(
  'workshops/update',
  async ({ id, data }: { id: string; data: Partial<Workshop> }, thunkAPI) => {
    try {
      const docRef = doc(db, 'workshops', id);
      await updateDoc(docRef, data);
      return { id, data };
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Async thunk: delete workshop by id
export const deleteWorkshop = createAsyncThunk(
  'workshops/delete',
  async (id: string, thunkAPI) => {
    try {
      const docRef = doc(db, 'workshops', id);
      await deleteDoc(docRef);
      return id;
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const workshopsSlice = createSlice({
  name: 'workshops',
  initialState,
  reducers: {
    // Optional synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // fetch workshops
      .addCase(fetchWorkshops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkshops.fulfilled, (state, action: PayloadAction<Workshop[]>) => {
        state.loading = false;
        state.workshops = action.payload;
      })
      .addCase(fetchWorkshops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // add workshop
      .addCase(addWorkshop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWorkshop.fulfilled, (state, action: PayloadAction<Workshop>) => {
        state.loading = false;
        state.workshops.push(action.payload);
      })
      .addCase(addWorkshop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // update workshop
      .addCase(updateWorkshop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateWorkshop.fulfilled,
        (state, action: PayloadAction<{ id: string; data: Partial<Workshop> }>) => {
          state.loading = false;
          const index = state.workshops.findIndex((w) => w.id === action.payload.id);
          if (index !== -1) {
            state.workshops[index] = { ...state.workshops[index], ...action.payload.data };
          }
        }
      )
      .addCase(updateWorkshop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // delete workshop
      .addCase(deleteWorkshop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkshop.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.workshops = state.workshops.filter((w) => w.id !== action.payload);
      })
      .addCase(deleteWorkshop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default workshopsSlice.reducer;
