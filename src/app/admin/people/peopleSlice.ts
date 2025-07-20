// store/peopleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Person {
  id: string;
  name: string;
  bio?: string;
  photoUrl?: string;
  linkedInUrl?: string;
  email?: string;
  connectedWithLinkedIn?: boolean;
}

interface PeopleState {
  people: Person[];
  loading: boolean;
  error: string | null;
}

const initialState: PeopleState = {
  people: [],
  loading: false,
  error: null,
};

export const fetchPeople = createAsyncThunk('people/fetchPeople', async () => {
  const querySnapshot = await getDocs(collection(db, 'people'));
  const people: Person[] = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Person[];
  return people;
});

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeople.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeople.fulfilled, (state, action: PayloadAction<Person[]>) => {
        state.people = action.payload;
        state.loading = false;
      })
      .addCase(fetchPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch people';
      });
  },
});

export default peopleSlice.reducer;
