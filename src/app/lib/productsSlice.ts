import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ProductType = 'drink' | 'meal' | 'snack' | 'dessert';

export type BusinessProduct = {
  id?: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isAvailable: boolean;
  featured?: boolean;
  type: ProductType;
  category?: string;
};

export type BusinessProductsConfig = {
  isEnabled: boolean;
  products: BusinessProduct[];
};

type ProductsState = {
  productsConfig: BusinessProductsConfig;
};

const initialState: ProductsState = {
  productsConfig: {
    isEnabled: true,
    products: [],
  },
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductsConfig(state, action: PayloadAction<BusinessProductsConfig>) {
      state.productsConfig = action.payload;
    },
    addProduct(state, action: PayloadAction<BusinessProduct>) {
      state.productsConfig.products.push(action.payload);
    },
    toggleProductsEnabled(state, action: PayloadAction<boolean>) {
      state.productsConfig.isEnabled = action.payload;
    },
  },
});

export const { setProductsConfig, addProduct, toggleProductsEnabled } =
  productsSlice.actions;

export default productsSlice.reducer;
