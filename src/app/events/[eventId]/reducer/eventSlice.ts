// src/app/admin/events/reducer/eventSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Event } from '@/types/event';
import {
  createDocument,
  getCollection,
  getDocument,
  updateDocument,
  deleteDocument,
} from '@/services/firestoreService';

const collectionPath = 'events';

export const fetchEvents = createAsyncThunk('events/fetchAll', async () => {
  return await getCollection<Event>(collectionPath);
});

export const fetchEventById = createAsyncThunk(
  'events/fetchById',
  async (idi: string) => {
    const data = await getDocument(collectionPath, idi);
    if (!data) throw new Error('Event not found');

    // Destructure to exclude the id property from data
    const { id, ...rest } = data as Event;

    return { id, ...rest };
  }
);



export const createEvent = createAsyncThunk<
  Event,
  Omit<Event, 'id'>,
  { rejectValue: unknown }
>(
  'events/create',
  async (event, { rejectWithValue }) => {
    try {

      const id = await createDocument<Event>(collectionPath, event);
      return { id, ...event };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);



export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, data }: { id: string; data: Partial<Event> }, { rejectWithValue }) => {
    try {
      await updateDocument(collectionPath, id, data);
      return { id, data };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDocument(collectionPath, id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type EventsState = {
  events: Event[];
  currentEvent?: Event;
  loading: boolean;
  error: string | null;
};

const initialState: EventsState = {
  events: [],
  currentEvent: undefined,
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent(state) {
      state.currentEvent = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      })

      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })

      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
        state.loading = false;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = { ...state.events[index], ...action.payload.data };
        }
      })

      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e.id !== action.payload);
      });
  },
});

export const { clearCurrentEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
