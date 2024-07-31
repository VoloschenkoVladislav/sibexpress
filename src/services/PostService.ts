import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';


export interface PostInterface {
  id: number,
  title: string,
  type_id: number,
  status_id: number,
  published_at: string,
}

export interface LinksInterface {
  first: string,
  last: string,
  prev: string,
  next: string,
}

export interface MetaInterface {
  current_page: number,
  from: number,
  path: string,
  per_page: number,
  to: number,
}

export interface PostsResponseData {
  items: PostInterface[],
  links: LinksInterface,
  meta: MetaInterface,
}

export const postAPI = createApi({
  reducerPath: 'postAPI',
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
    posts: build.query<IResponse<PostsResponseData, null>, number>({
      query: page => ({ url: `/posts?page=${page}` }),
    }),
  }),
});

export const {
  useLazyPostsQuery
} = postAPI;
