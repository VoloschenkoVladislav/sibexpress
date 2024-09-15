import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';
import { API_PATH, BASE_BACKEND_URL } from '../constants/baseUrl';
import paramsSerializer from './utils/paramsSerializer';


export interface IShortPost {
  id: number,
  title: string,
  type_id: number,
  status_id: number,
  published_at: string,
}

export interface IPost {
  id: number,
  type_id: number,
  status_id: number,
  title: string,
  raw_content: string | null,
  media: {
    thumb: string | null,
    images: string[],
    src: string,
  },
  created_at: string,
  updated_at: string,
  published_at: string,
  tags_id: number[],
}

export interface ILinks {
  first: string | null,
  last: string | null,
  prev: string | null,
  next: string | null,
}

export interface IMeta {
  current_page: number,
  from: number,
  path: string,
  per_page: number,
  to: number,
}

export interface IPostsResponse {
  items: IShortPost[],
  links: ILinks,
  meta: IMeta,
}

export interface INewPostResponse {
  id: number,
}

export interface IUploadThumbnailResponse {
  src: string,
  thumb: string,
}

export interface IUploadImagesResponse {
  images: string[],
}

export interface IDeleteImagesResponse {
  images: string[],
}

export interface IPostEditRequest {
  type_id: number | null,
  status_id: number | null,
  title: string,
  raw_content: string | null,
  tags_id: number[],
  published_at: string | null,
}

export const postAPI = createApi({
  reducerPath: 'postAPI',
  tagTypes: ['postCreated', 'postEdited', 'postDeleted'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_BACKEND_URL}${API_PATH}`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootState).authReducer;
      if (accessToken) {
        headers.set('Authorization', accessToken)
      }
      return headers
    },
    paramsSerializer,
  }),
  endpoints: build => ({
    getPosts: build.query<IResponse<IPostsResponse, any>, { page: number, perPage: number }>({
      query: ({ page, perPage }) => {
        return {
          url: `/posts`,
          params: { page, per_page: perPage },
        }
      },
      keepUnusedDataFor: 10,
      providesTags: ['postCreated', 'postDeleted'],
    }),
    createPost: build.mutation<IResponse<INewPostResponse, any>, string>({
      query: title => {
        return {
          url: `/posts`,
          method: 'POST',
          params: { title },
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['postCreated'],
    }),
    getPost: build.query<IResponse<IPost, any>, number>({
      query: id => ({ url: `/posts/${id}` }),
      keepUnusedDataFor: 0,
    }),
    editPost: build.mutation<IResponse<null, any>, { id: number, postData: IPostEditRequest }>({
      query: ({ id, postData }) => {
        return {
          url: `/posts/${id}`,
          method: 'POST',
          params: postData,
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['postEdited'],
    }),
    deletePost: build.mutation<IResponse<null, any>, number>({
      query: id => {
        return {
          url: `/posts/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['postDeleted'],
    }),
    uploadThumbnail: build.mutation<IResponse<IUploadThumbnailResponse, any>, { id: number, thumbnail: FormData }>({
      query: ({ id, thumbnail }) => {
        return {
          url: `/posts/${id}/thumbnail`,
          method: 'POST',
          body: thumbnail,
          formData: true,
        }
      }
    }),
    deleteThumbnail: build.mutation<IResponse<null, any>, number>({
      query: id => {
        return {
          url: `/posts/${id}/thumbnail`,
          method: 'DELETE',
        }
      }
    }),
    uploadImages: build.mutation<IResponse<IUploadImagesResponse, any>, { id: number, images: FormData }>({
      query: ({ id, images }) => {
        return {
          url: `/posts/${id}/images`,
          method: 'POST',
          body: images,
          formData: true,
        }
      }
    }),
    deleteImages: build.mutation<IResponse<IDeleteImagesResponse, any>, { id: number, images: string[] }>({
      query: ({ id, images }) => {
        return {
          url: `/posts/${id}/images`,
          method: 'DELETE',
          params: { images },
        }
      }
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useEditPostMutation,
  useDeletePostMutation,
  useCreatePostMutation,
  useUploadThumbnailMutation,
  useDeleteThumbnailMutation,
  useUploadImagesMutation,
  useDeleteImagesMutation,
} = postAPI;
