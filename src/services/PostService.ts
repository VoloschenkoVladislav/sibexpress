import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';


export interface ShortPostInterface {
  id: number,
  title: string,
  type_id: number,
  status_id: number,
  published_at: string,
}

export interface PostInterface {
  id: number,
  type_id: number,
  status_id: number,
  title: string,
  content: string,
  media: {
    thumb: {
      src: string,
    },
    images: string[],
    src: string,
  },
  created_at: string,
  updated_at: string,
  published_at: string,
  topics: number[],
}

export interface LinksInterface {
  first: string | null,
  last: string | null,
  prev: string | null,
  next: string | null,
}

export interface MetaInterface {
  current_page: number,
  from: number,
  path: string,
  per_page: number,
  to: number,
}

export interface PostsResponseData {
  items: ShortPostInterface[],
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
    posts: build.query<IResponse<PostsResponseData, null>, { page: number, perPage: number }>({
      query: ({ page, perPage }) => ({ url: `/posts?page=${page}&per_page=${perPage}` }),
      keepUnusedDataFor: 10,
    }),
    post: build.query<IResponse<PostInterface, undefined>, number>({
      query: postId => ({ url: `/posts/${postId}` }),
      keepUnusedDataFor: 1,
    }),
    uploadThumbnail: build.mutation<any, { postId: number, imageFile: File }>({
      query: ({ postId, imageFile }) => {
        const bodyFormData = new FormData();
        bodyFormData.append('file', imageFile, imageFile.name);
        return {
          url: `/posts/${postId}/thumbnail`,
          method: 'POST',
          body: bodyFormData,
          formData: true,
        }
      }
    }),
  }),
});

export const {
  usePostsQuery,
  usePostQuery,
  useUploadThumbnailMutation,
} = postAPI;
