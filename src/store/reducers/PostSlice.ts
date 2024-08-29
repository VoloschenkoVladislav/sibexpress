import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from "@reduxjs/toolkit";
import { postAPI } from "../../services/PostService";


interface PostState {
  content: string | null,
  type_id: number | null,
  status_id: number | null,
  tags_id: number[],
  title: string,
  published_at: string | null,
  created_at: string | null,
  updated_at: string | null,
  media: {
    thumb: string | null,
    images: string[],
    src: string | null,
  }
}

const initialState: PostState = {
  content: null,
  type_id: null,
  status_id: null,
  tags_id: [],
  title: '',
  published_at: null,
  created_at: null,
  updated_at: null,
  media: {
    thumb: null,
    images: [],
    src: null,
  }
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    updatePost: (state, action: PayloadAction<PostState>) => {
      state.published_at = action.payload.published_at;
      state.content = action.payload.content;
      state.type_id = action.payload.type_id;
      state.status_id = action.payload.status_id;
      state.tags_id = action.payload.tags_id;
      state.title = action.payload.title;
      state.published_at = action.payload.published_at;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(postAPI.endpoints.getPost.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          const {
            raw_content,
            type_id,
            status_id,
            tags_id,
            title,
            published_at,
            updated_at,
            created_at,
            media,
          } = action.payload.data;
          state.published_at = published_at;
          state.updated_at = updated_at;
          state.created_at = created_at;
          state.type_id = type_id;
          state.status_id = status_id;
          state.tags_id = tags_id;
          state.title = title;
          state.media = media;
          state.content = raw_content;
        }
      })
      .addMatcher(postAPI.endpoints.uploadImages.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          state.media.images = action.payload.data.images;
        }
      })
      .addMatcher(postAPI.endpoints.deleteImages.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          state.media.images = action.payload.data.images;
        }
      })
      .addMatcher(postAPI.endpoints.uploadThumbnail.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          state.media.thumb = action.payload.data.thumb;
          state.media.src = action.payload.data.src;
        }
      })
      .addMatcher(postAPI.endpoints.deleteThumbnail.matchFulfilled, (state, action) => {
        state.media.thumb = null;
      })
  }
});

export const { updatePost } = postsSlice.actions;

export default postsSlice.reducer;
