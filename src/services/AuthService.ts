import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';


export interface AuthRequestBody {
  email: string,
  password: string,
}

export interface AuthResponseData {
  id: number,
  access_token: string,
  access_type: string,
  expires: string,
  abilities: string[],
}

export interface AuthResponseError {
  email?: string,
  password?: string,
}

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootState).authReducer;
      if (accessToken) {
        headers.set('Authorization', accessToken)
      }
      return headers
    },
  }),
  endpoints: build => ({
    login: build.mutation<IResponse<AuthResponseData, AuthResponseError>, AuthRequestBody>({
      query: requestBody => ({
        url: '/auth',
        method: 'POST',
        body: {
          email: requestBody.email,
          password: requestBody.password,
        },
      }),
    }),
    logout: build.query<IResponse<null, null>, void>({
      query: () => ({ url: '/logout' }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLazyLogoutQuery
} = authAPI;
