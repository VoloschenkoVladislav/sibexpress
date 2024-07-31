import { createSlice } from "@reduxjs/toolkit"
import { IUser } from "../../models/IUser"
import { authAPI, AuthResponseData, AuthResponseError } from "../../services/AuthService";
import { IResponse } from "../../models/IApi";
import Cookies from 'js-cookie';
import { PERMISSIONS } from "../../constants/permission";


interface AuthState {
  user: IUser | null,
  accessToken: string | null,
  isAuthorized: boolean,
  authError?: AuthResponseError | null,
  errorMessage?: string | null,
  errorCode?: string | null
}

const getUserFromCookie = () => {
  return (
    Cookies.get('access_token')
      ? {
        id: 0,
        email: '',
        name: '',
        permissions: JSON.parse(Cookies.get('abilities')),
      } as IUser
      : null
  );
}

const initialState: AuthState = {
  user: getUserFromCookie(),
  accessToken: Cookies.get('access_token') || null,
  isAuthorized: !!Cookies.get('access_token'),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: state => {
      state.errorMessage = null;
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(authAPI.endpoints.login.matchFulfilled, (state, action) => {
        if (action.payload.data) {
          const { access_token, expires, access_type, abilities, id } = action.payload.data;
          state.isAuthorized = true;
          state.accessToken = access_token;
          state.authError = null;
          state.user = {
            id,
            email: '',
            name: '',
            permissions: abilities as PERMISSIONS[],
          }
          Cookies.set('access_token', `${access_type} ${access_token}`, { expires: new Date(expires) });
          Cookies.set('abilities', JSON.stringify(abilities), { expires: new Date(expires) });
        }
      })
      .addMatcher(authAPI.endpoints.login.matchRejected, (state, action) => {
        const data = action.payload && action.payload.data as IResponse<AuthResponseData, AuthResponseError>;
        state.authError = data?.errors;
        state.errorMessage = data?.error_message;
      })
      .addMatcher(authAPI.endpoints.logout.matchFulfilled, (state, action) => {
        state.isAuthorized = false;
        state.user = null;
        state.accessToken = null;
        state.authError = null;
        Cookies.remove('access_token');
        Cookies.remove('abilities');
      })
      .addMatcher(authAPI.endpoints.logout.matchRejected, (state, action) => {
        const data = action.payload && action.payload.data as IResponse<null, null>;
        state.isAuthorized = false;
        state.user = null;
        state.accessToken = null;
        state.authError = null;
        state.errorMessage = data?.error_message;
        Cookies.remove('access_token');
        Cookies.remove('abilities');
      })
  }
});

export const { resetError } = authSlice.actions;

export default authSlice.reducer;
