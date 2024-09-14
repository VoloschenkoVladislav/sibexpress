import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';
import formDataSerializer from './utils/formDataSerializer';
import { API_PATH, BASE_BACKEND_URL } from '../constants/baseUrl';


export interface IToken {
  id: number,
  name: string,
  permissions: string[],
  created_at: string | null,
  updated_at: string | null,
  last_used_at: string | null
};

export interface IShortUser {
  id: number,
  email: string,
  name: string,
  created_at: string,
  updated_at: string,
};

export interface IUser {
  id: number,
  email: string,
  name: string,
  created_at: string,
  updated_at: string,
  permissions: string[],
  tokens: IToken[],
};

export interface ILinks {
  first: string | null,
  last: string | null,
  prev: string | null,
  next: string | null,
};

export interface IMeta {
  current_page: number,
  from: number,
  path: string,
  per_page: number,
  to: number,
};

export interface ICreateUserRequest {
  name: string,
  email: string,
  password: string,
};

export interface IUsersResponse {
  items: IShortUser[],
  links: ILinks,
  meta: IMeta,
};

export interface INewUserResponse {
  id: number,
};

export interface IUserEditRequest {
  name: string,
  password?: string,
  permissions: string[],
};

export const userAPI = createApi({
  reducerPath: 'userAPI',
  tagTypes: ['userCreated', 'userEdited', 'userDeleted'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_BACKEND_URL}${API_PATH}`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootState).authReducer;
      if (accessToken) {
        headers.set('Authorization', accessToken)
      }
      return headers
    },
  }),
  endpoints: build => ({
    getUsers: build.query<IResponse<IUsersResponse, any>, { page: number, perPage: number }>({
      query: ({ page, perPage }) => {
        return {
          url: `/users`,
          params: { page, per_page: perPage },
        }
      },
      keepUnusedDataFor: 10,
      providesTags: ['userCreated', 'userDeleted'],
    }),
    createUser: build.mutation<IResponse<INewUserResponse, any>, ICreateUserRequest>({
      query: data => {
        return {
          url: `/users`,
          method: 'POST',
          body: formDataSerializer(data),
          formData: true,
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['userCreated'],
    }),
    getUser: build.query<IResponse<IUser, any>, number>({
      query: id => ({ url: `/users/${id}` }),
      keepUnusedDataFor: 0,
    }),
    editUser: build.mutation<IResponse<null, any>, { id: number, userData: IUserEditRequest }>({
      query: ({ id, userData }) => {
        return {
          url: `/users/${id}`,
          method: 'POST',
          body: formDataSerializer(userData),
          formData: true,
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['userEdited'],
    }),
    deleteUser: build.mutation<IResponse<null, any>, number>({
      query: id => {
        return {
          url: `/users/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['userDeleted'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useEditUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
} = userAPI;
