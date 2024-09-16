import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';
import { API_PATH, BASE_BACKEND_URL } from '../constants/baseUrl';
import paramsSerializer from './utils/paramsSerializer';


export interface ITopic {
  id: number,
  title: string,
  count: number,
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

export interface ITopicsResponse {
  items: ITopic[],
  links: ILinks,
  meta: IMeta,
}

export const topicAPI = createApi({
  reducerPath: 'topcicAPI',
  tagTypes: ['topicCreate', 'topicEdit', 'topicDelete'],
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
    getTopics: build.query<IResponse<ITopicsResponse, any>, { page: number, perPage: number }>({
      query: ({ page, perPage }) => {
        return {
          url: `/tags`,
          params: { page, per_page: perPage },
        }
      },
      keepUnusedDataFor: 10,
      providesTags: ['topicCreate', 'topicEdit', 'topicDelete'],
    }),
    createTopic: build.mutation<IResponse<any, any>, string>({
      query: title => {
        return {
          url: `/tags`,
          method: 'POST',
          body: { title },
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['topicCreate'],
    }),
    editTopic: build.mutation<IResponse<any, any>, { id: number, title: string }>({
      query: ({ id, title }) => {
        return {
          url: `/tags/${id}`,
          method: 'POST',
          body: { title },
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['topicEdit'],
    }),
    deleteTopic: build.mutation<IResponse<any, any>, number>({
      query: id => {
        return {
          url: `/tags/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['topicDelete'],
    }),
  }),
});

export const {
  useGetTopicsQuery,
  useEditTopicMutation,
  useDeleteTopicMutation,
  useCreateTopicMutation,
} = topicAPI;
