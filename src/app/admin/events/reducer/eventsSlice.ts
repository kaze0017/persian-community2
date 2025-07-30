// src/store/eventSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '@/types/event';
import {
  createDocument,
  getCollection,
  updateDocument,
  deleteDocument,
  getDocument,
  createDocumentWithId
} from '@/services/firestoreService';
import { uploadImage } from '@/services/storageService';
import { Banner } from '@/types/banner';

const EVENTS_COLLECTION = 'events';

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchEventById = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>('events/fetchEventById', async (id, { rejectWithValue }) => {
  const doc = await getDocument(EVENTS_COLLECTION, id);

  if (!doc) {
    return rejectWithValue(`Event with ID "${id}" not found.`);
  }

  return { id: doc.id, ...doc} as Event;
});

export const fetchEvents = createAsyncThunk<
  Event[],
  void,
  { rejectValue: string }
>('events/fetchEvents', async (_, thunkAPI) => {
  try {
    const events = await getCollection(EVENTS_COLLECTION);
    return events as Event[];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch events';
    return thunkAPI.rejectWithValue(message);
  }
});

function removeUndefinedFields<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const createEvent = createAsyncThunk<
  Event,
  { event: Omit<Event, 'id'>; bannerFile?: File },
  { rejectValue: string }
>('events/createEvent', async ({ event, bannerFile }, thunkAPI) => {
  console.log('Creating event with data:', event);
  try {
    const cleanEventData = removeUndefinedFields(event);
    const id = await createDocumentWithId(EVENTS_COLLECTION, cleanEventData);

    let bannerUrls: Banner | undefined;
    if (bannerFile) {
      const uploadedUrl = await uploadImage(
        bannerFile,
        `events/${id}/banner`,
        'banner.jpg'
      );
      bannerUrls = {
        original: uploadedUrl,
        sizes: {
          small: uploadedUrl.replace('.jpg', '_small.webp'),
          medium: uploadedUrl.replace('.jpg', '_medium.webp'),
          large: uploadedUrl.replace('.jpg', '_large.webp'),
          xlarge: uploadedUrl.replace('.jpg', '_xlarge.webp'),
        },
      };
      console.log(`Banner uploaded for event ${id}:`, bannerUrls);
      await updateDocument(EVENTS_COLLECTION, id, { bannerUrls });
    }

    return { ...cleanEventData, bannerUrls, id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create event';
    return thunkAPI.rejectWithValue(message);
  }
});



export const updateEvent = createAsyncThunk<
  Event,
  { id: string; updatedData: Partial<Event> },
  { rejectValue: string }
>('events/updateEvent', async ({ id, updatedData }, thunkAPI) => {
  try {
    await updateDocument(EVENTS_COLLECTION, id, updatedData);
    return { id, ...updatedData } as Event;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update event';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteEvent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('events/deleteEvent', async (id, thunkAPI) => {
  try {
    await deleteDocument(EVENTS_COLLECTION, id);
    return id;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete event';
    return thunkAPI.rejectWithValue(message);
  }
});

// Slice

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<string>) => {
      const found = state.events.find((e) => e.id === action.payload);
      state.selectedEvent = found || null;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: builder => {
    builder
      // fetchEvents
      .addCase(fetchEvents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch events';
      })

      // fetchEventById
      .addCase(fetchEventById.pending, state => {
        state.loading = true;
        state.error = null;
        state.selectedEvent = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action: PayloadAction<Event>) => {
        state.selectedEvent = action.payload;
        state.loading = false;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch event';
      })

      // createEvent
      .addCase(createEvent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.push(action.payload);
        state.loading = false;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to create event';
      })

      // updateEvent
      .addCase(updateEvent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.events.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to update event';
      })

      // deleteEvent
      .addCase(deleteEvent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.events = state.events.filter(e => e.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to delete event';
      });
  },
});

export const { setSelectedEvent, clearSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;
