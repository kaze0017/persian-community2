// categoriesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Adjust the import path as necessary
import {Category} from '@/types/category'; // Adjust the import path as necessary



interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

// Async thunk to fetch categories from Firestore
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categories: Category[] = [];
      querySnapshot.forEach(docSnap => {
        categories.push({ id: docSnap.id, ...docSnap.data() } as Category);
      });
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return thunkAPI.rejectWithValue('Failed to fetch categories');
    }
  }
);

// Async thunk to add a category to Firestore
export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category: Omit<Category, 'id'>, thunkAPI) => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), category);
      return { id: docRef.id, ...category };
    } catch (error) {
      console.error('Failed to add category:', error);
      return thunkAPI.rejectWithValue('Failed to add category');
    }
  }
);

// Async thunk to update a category by id
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (category: Category, thunkAPI) => {
    try {
      const docRef = doc(db, 'categories', category.id);
      await updateDoc(docRef, {
        name: category.name,
        icon: category.icon,
      });
      return category;
    } catch (error) {
      console.error('Failed to update category:', error);
      return thunkAPI.rejectWithValue('Failed to update category');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // you can add local-only reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // addCategory
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.categories.push(action.payload);
        state.loading = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default categoriesSlice.reducer;
