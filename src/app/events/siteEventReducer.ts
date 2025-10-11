import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Event } from "@/types/event";
import { fetchFullEventById } from "./siteEventApi";

interface SiteEventsState {
  event: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: SiteEventsState = {
  event: null,
  loading: false,
  error: null,
};

// Thunk using the API
export const fetchSiteEvent = createAsyncThunk<Event, string>(
  "siteEvents/fetchSiteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await fetchFullEventById(eventId);
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  }
);

const siteEventsSlice = createSlice({
  name: "siteEvents",
  initialState,
  reducers: {
    clearEvent: (state) => {
      state.event = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.event = action.payload;
      })
      .addCase(fetchSiteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearEvent } = siteEventsSlice.actions;
export default siteEventsSlice.reducer;
