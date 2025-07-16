import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { RestaurantProduct } from '@/types/RestaurantProduct';
import { db } from '@/lib/firebase';

// Subcollection item type
export type ProductItem = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  available?: boolean;
};

// Product type with items subcollection
// export type RestaurantProduct = {
//   id: string;
//   name: string;
//   description?: string;
//   category?: string;
//   items: ProductItem[];
// };

// Fetch products + subcollection items
export const fetchRestaurantProductsWithItems = createAsyncThunk(
  'restaurantProducts/fetchAllWithItems',
  async (businessId: string) => {
    const productsSnapshot = await getDocs(
      collection(db, 'businesses', businessId, 'products')
    );

    const productPromises = productsSnapshot.docs.map(async (productDoc) => {
      const productData = productDoc.data();
      const productId = productDoc.id;

      const itemsSnapshot = await getDocs(
        collection(db, 'businesses', businessId, 'products', productId, 'items')
      );

      const items: ProductItem[] = itemsSnapshot.docs.map((itemDoc) => ({
        id: itemDoc.id,
        ...itemDoc.data(),
      })) as ProductItem[];

      return {
        id: productId,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        items,
      };
    });

    const productsWithItems: RestaurantProduct[] = await Promise.all(
      productPromises
    );
    return productsWithItems;
  }
);

export const addRestaurantProduct = createAsyncThunk(
  'restaurantProducts/add',
  async ({
    businessId,
    product,
  }: {
    businessId: string;
    product: Omit<RestaurantProduct, 'id' | 'items'>;
  }) => {
    const docRef = await addDoc(
      collection(db, 'businesses', businessId, 'products'),
      product
    );
    return { id: docRef.id, ...product, items: [] };
  }
);

export const updateRestaurantProduct = createAsyncThunk(
  'restaurantProducts/update',
  async ({
    businessId,
    productId,
    updates,
  }: {
    businessId: string;
    productId: string;
    updates: Partial<Omit<RestaurantProduct, 'id' | 'items'>>;
  }) => {
    const productRef = doc(db, 'businesses', businessId, 'products', productId);
    await updateDoc(productRef, updates);
    return { productId, updates };
  }
);

export const deleteRestaurantProduct = createAsyncThunk(
  'restaurantProducts/delete',
  async ({
    businessId,
    productId,
  }: {
    businessId: string;
    productId: string;
  }) => {
    await deleteDoc(doc(db, 'businesses', businessId, 'products', productId));
    return productId;
  }
);

type RestaurantProductsState = {
  items: RestaurantProduct[];
  loading: boolean;
  error: string | null;
};

const initialState: RestaurantProductsState = {
  items: [],
  loading: false,
  error: null,
};

const restaurantProductsSlice = createSlice({
  name: 'restaurantProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantProductsWithItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantProductsWithItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRestaurantProductsWithItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(addRestaurantProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRestaurantProduct.fulfilled, (state, action) => {
        const { productId, updates } = action.payload;
        const index = state.items.findIndex((p) => p.id === productId);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...updates,
          };
        }
      })
      .addCase(deleteRestaurantProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default restaurantProductsSlice.reducer;
