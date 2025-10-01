import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "@/types/event";
import * as eventApi from "@/app/client/events/eventsApi";

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
  async (clientId: string) => {
    return await eventApi.getUserEvents(clientId);
  }
);

export const addUserEvent = createAsyncThunk(
  "clientEvents/addUserEvent",
  async ({ clientId, event, bannerFile }: { clientId: string; event: Omit<Event, "id">; bannerFile?: File }) => {
    console.log("Adding event:", event, "with banner file:", bannerFile);
    return await eventApi.addEvent(clientId, event, bannerFile);
  }
);

export const updateUserEvent = createAsyncThunk(
  "clientEvents/updateUserEvent",
  async ({ clientId, id, updates, bannerFile }: { clientId: string; id: string; updates: Partial<Event>; bannerFile?: File }) => {
    console.log("Updating event:", updates, "with banner file:", bannerFile);
    await eventApi.updateEvent(clientId, id, updates, bannerFile ?? undefined);
    return { id, updates };
  }
);

export const deleteUserEvent = createAsyncThunk(
  "clientEvents/deleteUserEvent",
  async ({ clientId, eventId }: { clientId: string; eventId: string }) => {
    await eventApi.deleteEvent(clientId, eventId);
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
        const { id, updates } = action.payload;
        const index = state.events.findIndex((e) => e.id === id);
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
