import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';
import { PERMISSIONS } from '../constants/permission';


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
  baseQuery: fetchBaseQuery({
    baseUrl: '/api-admin/v1',
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
