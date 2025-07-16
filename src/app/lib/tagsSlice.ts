import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Tag } from '../../types/tags'; 


interface TagsState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  tags: [],
  loading: false,
  error: null,
};

// Fetch all tags
export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async (_, thunkAPI) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tags'));
      const tags: Tag[] = [];
      querySnapshot.forEach(docSnap => {
        tags.push({ id: docSnap.id, ...docSnap.data() } as Tag);
      });
      return tags;
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      return thunkAPI.rejectWithValue('Failed to fetch tags');
    }
  }
);

// Add a new tag
export const addTag = createAsyncThunk(
  'tags/addTag',
  async (tag: Omit<Tag, 'id'>, thunkAPI) => {
    try {
      const docRef = await addDoc(collection(db, 'tags'), tag);
      return { id: docRef.id, ...tag };
    } catch (error) {
      console.error('Failed to add tag:', error);
      return thunkAPI.rejectWithValue('Failed to add tag');
    }
  }
);

// Update an existing tag
export const updateTag = createAsyncThunk(
  'tags/updateTag',
  async (tag: Tag, thunkAPI) => {
    try {
      const docRef = doc(db, 'tags', tag.id);
      await updateDoc(docRef, {
        name: tag.name,
        color: tag.color,
      });
      return tag;
    } catch (error) {
      console.error('Failed to update tag:', error);
      return thunkAPI.rejectWithValue('Failed to update tag');
    }
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTags
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
        state.tags = action.payload;
        state.loading = false;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // addTag
      .addCase(addTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.tags.push(action.payload);
        state.loading = false;
      })
      .addCase(addTag.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // updateTag
      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        const index = state.tags.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tags[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default tagsSlice.reducer;
