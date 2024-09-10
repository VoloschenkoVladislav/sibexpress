import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from "@reduxjs/toolkit";
import { userAPI } from "../../services/UserService";


interface IUserState {
  email: string,
  name: string,
  permissions: string[],
  tokens: IUserToken[],
  created_at: string | null,
  updated_at: string | null,
};

interface IUserToken {
  id: number,
  name: string,
  permissions: string[],
  created_at: string | null,
  updated_at: string | null,
  last_used_at: string | null,
};

const initialState: IUserState = {
  email: '',
  name: '',
  permissions: [],
  tokens: [],
  created_at: null,
  updated_at: null,
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<{ name: string, permissions: string[] }>) => {
      state.name = action.payload.name;
      state.permissions = action.payload.permissions;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(userAPI.endpoints.getUser.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          const {
            email,
            name,
            permissions,
            tokens,
            created_at,
            updated_at,
          } = action.payload.data;
          state.email = email;
          state.name = name;
          state.permissions = permissions;
          state.tokens = tokens;
          state.created_at = created_at;
          state.updated_at = updated_at;
        }
      })
  }
});

export const { updateUser } = usersSlice.actions;

export default usersSlice.reducer;
