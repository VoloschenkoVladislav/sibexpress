import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from "@reduxjs/toolkit";
import { bannerAPI } from "../../services/BannerService";


interface IBannerState {
  title: string,
  place_id: number | null,
  status_id: number | null,
  link: string | null,
  filename: string | null,
  src: string | null,
  created_at: string | null,
  updated_at: string | null,
  started_at: string | null,
  finished_at: string | null,
}

interface IUpdateBannerState {
  title: string,
  place_id: number | null,
  status_id: number | null,
  link: string | null,
  started_at: string | null,
  finished_at: string | null,
}

const initialState: IBannerState = {
  title: '',
  place_id: null,
  status_id: null,
  link: null,
  filename: null,
  src: null,
  created_at: null,
  updated_at: null,
  started_at: null,
  finished_at: null,
}

export const bannersSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    updateBanner: (state, action: PayloadAction<IUpdateBannerState>) => {
      state.title = action.payload.title;
      state.place_id = action.payload.place_id;
      state.status_id = action.payload.status_id;
      state.link = action.payload.link;
      state.finished_at = action.payload.finished_at;
      state.started_at = action.payload.started_at;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(bannerAPI.endpoints.getBanner.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          const {
            title,
            place_id,
            status_id,
            link,
            filename,
            src,
            created_at,
            updated_at,
            finished_at,
            started_at,
          } = action.payload.data;
          state.title = title;
          state.place_id = place_id;
          state.status_id = status_id;
          state.link = link;
          state.filename = filename;
          state.src = src;
          state.created_at = created_at;
          state.updated_at = updated_at;
          state.finished_at = finished_at;
          state.started_at = started_at;
        }
      })
      .addMatcher(bannerAPI.endpoints.uploadBannerImage.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          state.filename = action.payload.data.src;
        }
      })
      .addMatcher(bannerAPI.endpoints.deleteBannerImage.matchFulfilled, (state, action) => {
        state.filename = null;
      })
  }
});

export const { updateBanner } = bannersSlice.actions;

export default bannersSlice.reducer;
