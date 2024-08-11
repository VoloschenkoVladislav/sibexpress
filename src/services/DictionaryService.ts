import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';


export interface PermissionInterface {
  id: number,
  name: string,
  description: string,
}

export interface TopicInterface {
  id: number,
  title: string,
}

export interface StatusInterface {
  id: number,
  title: string,
}

export interface TypeInterface {
  id: number,
  title: string,
}

export interface BannerPlaceInterface {
  id: number,
  title: string,
}

export interface DictionariesResponseData<T> {
  items: T[],
}

export const dictionariesAPI = createApi({
  reducerPath: 'dictionariesAPI',
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
    permissions: build.query<PermissionInterface[], void>({
      query: () => ({ url: '/dictionary/permissions' }),
      transformResponse: (response: IResponse<DictionariesResponseData<PermissionInterface>, null>, meta, arg) => {
        if (!!response.data) {
          return response.data.items;
        } else {
          return [];
        }
      }
    }),
    topics: build.query<TopicInterface[], void>({
      query: () => ({ url: '/dictionary/tags' }),
      transformResponse: (response: IResponse<DictionariesResponseData<TopicInterface>, null>, meta, arg) => {
        if (!!response.data) {
          return response.data.items;
        } else {
          return [];
        }
      }
    }),
    statuses: build.query<StatusInterface[], void>({
      query: () => ({ url: '/dictionary/statuses' }),
      transformResponse: (response: IResponse<DictionariesResponseData<StatusInterface>, null>, meta, arg) => {
        if (!!response.data) {
          return response.data.items;
        } else {
          return [];
        }
      }
    }),
    types: build.query<TypeInterface[], void>({
      query: () => ({ url: '/dictionary/types' }),
      transformResponse: (response: IResponse<DictionariesResponseData<TypeInterface>, null>, meta, arg) => {
        if (!!response.data) {
          return response.data.items;
        } else {
          return [];
        }
      }
    }),
    bannerPlaces: build.query<BannerPlaceInterface[], void>({
      query: () => ({ url: '/dictionary/banner_places' }),
      transformResponse: (response: IResponse<DictionariesResponseData<BannerPlaceInterface>, null>, meta, arg) => {
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
