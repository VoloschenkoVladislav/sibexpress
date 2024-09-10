import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface AppState {
  errors: string[] | null,
  success: string | null,
}

const initialState: AppState = {
  errors: null,
  success: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setErrors: (state, action: PayloadAction<string[]>) => {
      state.success = null;
      state.errors = action.payload;
    },
    resetErrors: state => {
      state.errors = null;
    },
    setSuccess: (state, action: PayloadAction<string>) => {
      state.errors = null;
      state.success = action.payload;
    },
    resetSuccess: state => {
      state.success = null;
    }
  },
});

export const {
  setErrors,
  resetErrors,
  setSuccess,
  resetSuccess,
} = appSlice.actions;

export default appSlice.reducer;
