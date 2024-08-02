import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postAPI } from "../../services/PostService";


interface PostState {
  content: string,
  type_id: number | null,
  status_id: number | null,
  tags_id: number[],
  title: string,
  published_at: Date | null,
}

const initialState: PostState = {
  content: '',
  type_id: null,
  status_id: null,
  tags_id: [],
  title: '',
  published_at: null,
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
          const { content, type_id, status_id, topics, title } = action.payload.data;
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
