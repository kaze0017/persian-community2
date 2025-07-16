// src/store/businessesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Business } from '@/types/business';
import {
    getCollection,
  getDocument,
} from '@/services/firestoreService';

const BUSINESSES_COLLECTION = 'businesses';

interface BusinessesState {
  items: Business[];
  selectedBusiness: Business | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessesState = {
  items: [],
  selectedBusiness: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBusinesses = createAsyncThunk<
  Business[],
  void,
  { rejectValue: string }
>('businesses/fetchBusinesses', async (_, thunkAPI) => {
  try {
    const businesses = await getCollection(BUSINESSES_COLLECTION);
    return businesses as Business[];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch businesses';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchBusinessById = createAsyncThunk<
  Business,
  string,
  { rejectValue: string }
>('businesses/fetchBusinessById', async (id, { rejectWithValue }) => {
  const doc = await getDocument(BUSINESSES_COLLECTION, id);
  if (!doc) return rejectWithValue(`Business with ID "${id}" not found.`);
  return { id: doc.id, ...doc } as Business;
});

// Slice
const businessesSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    setSelectedBusiness: (state, action: PayloadAction<string>) => {
      const found = state.items.find(b => b.id === action.payload);
      state.selectedBusiness = found || null;
    },
    clearSelectedBusiness: (state) => {
      state.selectedBusiness = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBusinesses
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action: PayloadAction<Business[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch businesses';
      })

      // fetchBusinessById
      .addCase(fetchBusinessById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedBusiness = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action: PayloadAction<Business>) => {
        state.selectedBusiness = action.payload;
        state.loading = false;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch business';
      });
  },
});

export const { setSelectedBusiness, clearSelectedBusiness } = businessesSlice.actions;
export default businessesSlice.reducer;
