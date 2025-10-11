import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PinImageFile {
  tempSrc: string; 
  file: File;
  uploadedUrl?: string; 
}

const initialState: { images: PinImageFile[] } = { images: [] };

export const pinImagesSlice = createSlice({
  name: 'pinImages',
  initialState,
  reducers: {
    addPinImage: (
      state,
      action: PayloadAction<{ tempSrc: string; file: File }>
    ) => {
      const { tempSrc, file } = action.payload; // ✅ extract values
      state.images.push({ tempSrc, file });
    },

    removePinImage: (state, action: PayloadAction<{ tempSrc: string }>) => {
      state.images = state.images.filter(img => img.tempSrc !== action.payload.tempSrc);
    },

    updatePinImageUrl: (state, action: PayloadAction<{ tempSrc: string; uploadedUrl: string }>) => {
      const { tempSrc, uploadedUrl } = action.payload; // ✅ extract values
      const img = state.images.find(img => img.tempSrc === tempSrc);
      if (img) img.uploadedUrl = uploadedUrl;
    },

    clearPinImages: state => {
      state.images = [];
    },
  },
});

export const { addPinImage, removePinImage, updatePinImageUrl, clearPinImages } = pinImagesSlice.actions;

// Selectors
export const selectAllPinImages = (state: { pinImages: typeof initialState }) => state.pinImages.images;
export const selectPendingUploads = (state: { pinImages: typeof initialState }) =>
  state.pinImages.images.filter(img => !img.uploadedUrl);
export const selectUploadedImages = (state: { pinImages: typeof initialState }) =>
  state.pinImages.images.filter(img => !!img.uploadedUrl);

export default pinImagesSlice.reducer;
