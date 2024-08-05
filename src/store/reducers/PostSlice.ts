import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postAPI } from "../../services/PostService";
import { dateParse } from "../../utils/dateParser";


interface PostState {
  content: string,
  type_id: number | null,
  status_id: number | null,
  tags_id: number[],
  title: string,
  published_at: Date | null,
  created_at: Date | null,
  updated_at: Date | null,
}

const initialState: PostState = {
  content: '',
  type_id: null,
  status_id: null,
  tags_id: [],
  title: '',
  published_at: null,
  created_at: null,
  updated_at: null,
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(postAPI.endpoints.post.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          const {
            content,
            type_id,
            status_id,
            topics,
            title,
            published_at,
            updated_at,
            created_at,
          } = action.payload.data;
          !!published_at ? state.published_at = dateParse(published_at): state.published_at = null;
          !!updated_at ? state.updated_at = dateParse(updated_at): state.updated_at = null;
          !!created_at ? state.created_at = dateParse(created_at): state.created_at = null;
          state.content = content;
          state.type_id = type_id;
          state.status_id = status_id;
          state.tags_id = topics;
          state.title = title;
        }
      })
  }
});

export const { setContent } = postsSlice.actions;

export default postsSlice.reducer;
