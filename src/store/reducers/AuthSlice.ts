import { createSlice } from "@reduxjs/toolkit"
import { IUser } from "../../models/IUser"
import { getToken, removeToken, setToken } from "../../cookie/cookie";
import { authAPI, AuthResponseData, AuthResponseError } from "../../services/AuthService";
import { IResponse } from "../../models/IApi";


interface AuthState {
  user: IUser | null,
  accessToken: string | null,
  isAuthorized: boolean,
  authError?: AuthResponseError | null,
}

const initialState: AuthState = {
  user: null,
  accessToken: getToken('access-token') || null,
  isAuthorized: !!getToken('access-token'),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(authAPI.endpoints.login.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          const { access_token, expires, token_type } = action.payload.data;
          state.isAuthorized = true;
          state.accessToken = access_token;
          state.authError = null;
          setToken('access-token', `${token_type} ${access_token}`, new Date(expires));
        }
      })
      .addMatcher(authAPI.endpoints.login.matchRejected, (state, action) => {
        const data = action.payload && action.payload.data as IResponse<AuthResponseData, AuthResponseError>;
        state.authError = data?.errors;
        if (data) {
          console.error('422 Auth error: ', data.error_message);
        } else {
          console.error('500 Server error');
        }
      })
      .addMatcher(authAPI.endpoints.logout.matchFulfilled, (state, action) => {
        state.isAuthorized = false;
        state.user = null;
        state.accessToken = null;
        state.authError = null;
        removeToken('access-token');
      })
  }
});

export default authSlice.reducer;
