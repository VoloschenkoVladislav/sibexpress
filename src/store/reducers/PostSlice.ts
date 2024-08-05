import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postAPI } from "../../services/PostService";


interface PostState {
  content: string,
  type_id: number | null,
  status_id: number | null,
  tags_id: number[],
  title: string,
  published_at: string | null,
  created_at: string | null,
  updated_at: string | null,
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
          state.published_at = published_at;
          state.updated_at = updated_at;
          state.created_at = created_at;
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
