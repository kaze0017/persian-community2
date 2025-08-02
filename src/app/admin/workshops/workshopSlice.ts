import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Workshop } from '@/types/workshop';

// Firestore raw data type if you need to map fields later
type FirestoreWorkshopData = Omit<Workshop, 'id'>;

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

// ✅ Fetch all workshops
export const fetchWorkshops = createAsyncThunk<
  Workshop[],
  void,
  { rejectValue: string }
>('workshops/fetchAll', async (_, thunkAPI) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'workshops'));
    const workshops: Workshop[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as FirestoreWorkshopData;
      workshops.push({
        id: docSnap.id,
        ...data,
      });
    });

    return workshops;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});

// ✅ Add new workshop
export const addWorkshop = createAsyncThunk<
  Workshop,
  Omit<Workshop, 'id'>,
  { rejectValue: string }
>('workshops/add', async (newWorkshop, thunkAPI) => {
  try {
    const docRef = await addDoc(collection(db, 'workshops'), newWorkshop);
    return { id: docRef.id, ...newWorkshop };
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});

// ✅ Update existing workshop
export const updateWorkshop = createAsyncThunk<
  { id: string; data: Partial<Workshop> },
  { id: string; data: Partial<Workshop> },
  { rejectValue: string }
>('workshops/update', async ({ id, data }, thunkAPI) => {
  try {
    const docRef = doc(db, 'workshops', id);
    await updateDoc(docRef, data);
    return { id, data };
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});

// ✅ Delete workshop
export const deleteWorkshop = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('workshops/delete', async (id, thunkAPI) => {
  try {
    await deleteDoc(doc(db, 'workshops', id));
    return id;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
});

const workshopsSlice = createSlice({
  name: 'workshops',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
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
        state.error = action.payload ?? 'Failed to fetch workshops';
      })

      // Add
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
        state.error = action.payload ?? 'Failed to add workshop';
      })

      // Update
      .addCase(updateWorkshop.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkshop.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workshops.findIndex((w) => w.id === action.payload.id);
        if (index !== -1) {
          state.workshops[index] = {
            ...state.workshops[index],
            ...action.payload.data,
          };
        }
      })
      .addCase(updateWorkshop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update workshop';
      })

      // Delete
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
        state.error = action.payload ?? 'Failed to delete workshop';
      });
  },
});

export default workshopsSlice.reducer;
