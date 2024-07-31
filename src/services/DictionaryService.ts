import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';


export interface Permission {
  id: number,
  name: string,
  description: string,
}

export interface Topic {
  id: number,
  title: string,
}

export interface Status {
  id: number,
  title: string,
}

export interface Type {
  id: number,
  title: string,
}

export interface BannerPlace {
  id: number,
  title: string,
}

export interface DictionariesResponseData<T> {
  items: T[],
}

export const dictionariesAPI = createApi({
  reducerPath: 'dictionariesAPI',
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
    permissions: build.query<IResponse<DictionariesResponseData<Permission>, null>, void>({
      query: () => ({ url: '/permissions' }),
    }),
    topics: build.query<IResponse<DictionariesResponseData<Topic>, null>, void>({
      query: () => ({ url: '/topics' }),
    }),
    statuses: build.query<IResponse<DictionariesResponseData<Status>, null>, void>({
      query: () => ({ url: '/statuses' }),
    }),
    types: build.query<IResponse<DictionariesResponseData<Type>, null>, void>({
      query: () => ({ url: '/types' }),
    }),
    bannerPlaces: build.query<IResponse<DictionariesResponseData<BannerPlace>, null>, void>({
      query: () => ({ url: '/banner_places' }),
    }),
  }),
});

export const {
  useLazyPermissionsQuery,
  useLazyTopicsQuery,
  useLazyStatusesQuery,
  useLazyTypesQuery,
  useLazyBannerPlacesQuery,
} = dictionariesAPI;
