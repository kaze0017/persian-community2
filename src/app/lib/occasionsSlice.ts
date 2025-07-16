import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust if needed
import { Occasion } from '@/types/occasions';

interface OccasionState {
  occasions: Occasion[];
  loading: boolean;
  error: string | null;
}

const initialState: OccasionState = {
  occasions: [],
  loading: false,
  error: null,
};

// Fetch all occasions
export const fetchOccasions = createAsyncThunk(
  'occasions/fetchOccasions',
  async (_, thunkAPI) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'occasions'));
      const occasions: Occasion[] = [];
      querySnapshot.forEach(docSnap => {
        occasions.push({ id: docSnap.id, ...docSnap.data() } as Occasion);
      });
      return occasions;
    } catch (error) {
      console.error('Failed to fetch occasions:', error);
      return thunkAPI.rejectWithValue('Failed to fetch occasions');
    }
  }
);

// Add a new occasion
export const addOccasion = createAsyncThunk(
  'occasions/addOccasion',
  async (occasion: Omit<Occasion, 'id'>, thunkAPI) => {
    try {
      const docRef = await addDoc(collection(db, 'occasions'), occasion);
      return { id: docRef.id, ...occasion };
    } catch (error) {
      console.error('Failed to add occasion:', error);
      return thunkAPI.rejectWithValue('Failed to add occasion');
    }
  }
);

// Update an existing occasion
export const updateOccasion = createAsyncThunk(
  'occasions/updateOccasion',
  async (occasion: Occasion, thunkAPI) => {
    try {
      const docRef = doc(db, 'occasions', occasion.id);
      await updateDoc(docRef, {
        title: occasion.title,
        description: occasion.description,
        date: occasion.date,
        icon: occasion.icon,
        imageURL: occasion.imageURL,
      });
      return occasion;
    } catch (error) {
      console.error('Failed to update occasion:', error);
      return thunkAPI.rejectWithValue('Failed to update occasion');
    }
  }
);

const occasionSlice = createSlice({
  name: 'occasions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchOccasions
      .addCase(fetchOccasions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOccasions.fulfilled, (state, action: PayloadAction<Occasion[]>) => {
        state.occasions = action.payload;
        state.loading = false;
      })
      .addCase(fetchOccasions.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // addOccasion
      .addCase(addOccasion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOccasion.fulfilled, (state, action: PayloadAction<Occasion>) => {
        state.occasions.push(action.payload);
        state.loading = false;
      })
      .addCase(addOccasion.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // updateOccasion
      .addCase(updateOccasion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOccasion.fulfilled, (state, action: PayloadAction<Occasion>) => {
        const index = state.occasions.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.occasions[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateOccasion.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default occasionSlice.reducer;
