import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';
import { API_PATH, BASE_BACKEND_URL } from '../constants/baseUrl';


export interface IPermission {
  name: string,
  title: string,
}

export interface ITopic {
  id: number,
  title: string,
}

export interface IStatus {
  id: number,
  title: string,
}

export interface IType {
  id: number,
  title: string,
}

export interface IBannerPlace {
  id: number,
  title: string,
}

export interface IDictionariesResponse<T> {
  items: T[],
}

export const dictionariesAPI = createApi({
  reducerPath: 'dictionariesAPI',
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
    permissions: build.query<IPermission[], void>({
      query: () => ({ url: '/dictionary/permissions' }),
      transformResponse: (response: IResponse<IDictionariesResponse<IPermission>, null>, meta, arg) => {
        if (!!response.data) {
          return response.data.items;
        } else {
          return [];
        }
      }
    }),
    topics: build.query<ITopic[], void>({
      query: () => ({ url: '/dictionary/tags' }),
      transformResponse: (response: IResponse<IDictionariesResponse<ITopic>, null>, meta, arg) => {
        if (!!response.data) {
          return response.data.items;
        } else {
          return [];
        }
      }
    }),
    statuses: build.query<IStatus[], void>({
      query: () => ({ url: '/dictionary/statuses' }),
      transformResponse: (response: IResponse<IDictionariesResponse<IStatus>, null>, meta, arg) => {
        if (!!response.data) {
          return response.data.items;
        } else {
          return [];
        }
      }
    }),
    types: build.query<IType[], void>({
      query: () => ({ url: '/dictionary/types' }),
      transformResponse: (response: IResponse<IDictionariesResponse<IType>, null>, meta, arg) => {
        if (!!response.data) {
          return response.data.items;
        } else {
          return [];
        }
      }
    }),
    bannerPlaces: build.query<IBannerPlace[], void>({
      query: () => ({ url: '/dictionary/banner_places' }),
      transformResponse: (response: IResponse<IDictionariesResponse<IBannerPlace>, null>, meta, arg) => {
        if (!!response.data) {
          return response.data.items;
        } else {
          return [];
        }
      }
    }),
  }),
});

export const {
  usePermissionsQuery,
  useTopicsQuery,
  useStatusesQuery,
  useTypesQuery,
  useBannerPlacesQuery,
} = dictionariesAPI;
