import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';
import { PERMISSIONS } from '../constants/permission';


export interface AuthRequestBody {
  email: string,
  password: string,
}

export interface AuthResponseData {
  access_token: string,
  token_type: string,
  expires: string,
}

export interface AuthResponseError {
  email?: string[],
  password?: string[],
}

export interface MeResponseData {
  id: number,
  name: string,
  email: string,
  authorized_at: string,
  expires: string,
  permissions: PERMISSIONS[],
}

export const authAPI = createApi({
  reducerPath: 'authAPI',
  tagTypes: ['MeData'],
  baseQuery: fetchBaseQuery({
    baseUrl: '/api-admin/v1',
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootState).authReducer;
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`)
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
      invalidatesTags: ['MeData'],
    }),
    me: build.query<IResponse<MeResponseData, string>, void>({
      query: () => ({ url: '/me' }),
      providesTags: ['MeData'],
    }),
    logout: build.query<IResponse<null, null>, void>({
      query: () => ({ url: '/logout' }),
    }),
  }),
});

export const {
  useLoginMutation,
  useMeQuery,
  useLazyLogoutQuery
} = authAPI;
