import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface PostState {
  postContent: string,
}

const initialState: PostState = {
  postContent: ''  
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.postContent = action.payload;
    }
  },
});

export const { setContent } = postsSlice.actions

export default postsSlice.reducer;
