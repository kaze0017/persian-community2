// peopleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Person } from '@/types/person';
import { fetchPeople } from './peopleThunks';

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
