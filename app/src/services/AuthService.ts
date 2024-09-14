import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';
import Cookies from 'js-cookie';
import { API_PATH, BASE_BACKEND_URL } from '../constants/baseUrl';


export interface AuthRequestBody {
  email: string,
  password: string,
}

export interface AuthResponseData {
  id: number,
  access_token: string,
  access_type: string,
  expires: string,
  permissions: string[],
}

export interface AuthResponseError {
  email?: string,
  password?: string,
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_BACKEND_URL}${API_PATH}`,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = (getState() as RootState).authReducer;
    if (accessToken) {
      headers.set('Authorization', accessToken)
    }
    return headers
  },
});

const baseQueryWithAuth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    window.location.href = '/login';
    Cookies.remove('access_token');
    Cookies.remove('abilities');
  }
  return result;
};

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: baseQueryWithAuth,
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
