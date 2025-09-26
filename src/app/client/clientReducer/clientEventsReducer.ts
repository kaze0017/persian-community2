import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "@/types/event";
import * as eventApi from "@/services/business/eventsApi";

interface ClientEventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientEventState = {
  events: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserEvents = createAsyncThunk(
  "clientEvents/fetchUserEvents",
  async (userId: string) => {
    return await eventApi.getUserEvents(userId);
  }
);

export const addUserEvent = createAsyncThunk(
  "clientEvents/addUserEvent",
  async ({ userId, event, bannerFile }: { userId: string; event: Omit<Event, "id">; bannerFile?: File }) => {
    return await eventApi.addEvent(userId, event, bannerFile);
  }
);

export const updateUserEvent = createAsyncThunk(
  "clientEvents/updateUserEvent",
  async ({ userId, eventId, updates, bannerFile }: { userId: string; eventId: string; updates: Partial<Event>; bannerFile?: File }) => {
    await eventApi.updateEvent(userId, eventId, updates, bannerFile);
    return { eventId, updates };
  }
);

export const deleteUserEvent = createAsyncThunk(
  "clientEvents/deleteUserEvent",
  async ({ userId, eventId }: { userId: string; eventId: string }) => {
    await eventApi.deleteEvent(userId, eventId);
    return eventId;
  }
);

const clientEventSlice = createSlice({
  name: "clientEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchUserEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      })

      // Add
      .addCase(addUserEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.push(action.payload);
      })

      // Update
      .addCase(updateUserEvent.fulfilled, (state, action) => {
        const { eventId, updates } = action.payload;
        const index = state.events.findIndex((e) => e.id === eventId);
        if (index >= 0) {
          state.events[index] = { ...state.events[index], ...updates };
        }
      })

      // Delete
      .addCase(deleteUserEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
      });
  },
});

export default clientEventSlice.reducer;
