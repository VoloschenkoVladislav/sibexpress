import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../models/IApi';
import { RootState } from '../store/store';


export interface IShortBanner {
  id: number,
  title: string,
  status_id: number | null,
  started_at: string | null,
  link: string | null,
  finished_at: string | null,
  place_id: number | null,
}

export interface IBanner {
  title: string,
  place_id: number | null,
  status_id: number | null,
  link: string | null,
  filename: string | null,
  src: string | null,
  created_at: string | null,
  updated_at: string | null,
  started_at: string | null,
  finished_at: string | null,
}

export interface IBannerEditRequest {
  title: string,
  status_id: number | null,
  started_at: string | null,
  link: string | null,
  finished_at: string | null,
  place_id: number | null,
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

export interface IBannersResponse {
  items: IShortBanner[],
  links: ILinks,
  meta: IMeta,
}

export const bannerAPI = createApi({
  reducerPath: 'bannerAPI',
  tagTypes: ['bannerCreate', 'bannerEdit', 'bannerDelete'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_API_PATH}`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootState).authReducer;
      if (accessToken) {
        headers.set('Authorization', accessToken)
      }
      return headers
    },
  }),
  endpoints: build => ({
    getBanners: build.query<IResponse<IBannersResponse, any>, { page: number, perPage: number }>({
      query: ({ page, perPage }) => {
        return {
          url: `/banners`,
          params: { page, per_page: perPage },
        }
      },
      keepUnusedDataFor: 10,
      providesTags: ['bannerCreate', 'bannerEdit', 'bannerDelete'],
    }),
    getBanner: build.query<IResponse<IBanner, any>, number>({
      query: id => {
        return {
          url: `/banners/${id}`,
        }
      },
      keepUnusedDataFor: 0,
    }),
    createBanner: build.mutation<IResponse<{ id: number }, any>, string>({
      query: title => {
        return {
          url: `/banners`,
          method: 'POST',
          params: { title },
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['bannerCreate'],
    }),
    editBanner: build.mutation<IResponse<{ id: number }, any>, { id: number, data: IBannerEditRequest }>({
      query: ({ id, data }) => {
        return {
          url: `/banners/${id}`,
          method: 'POST',
          params: data,
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['bannerEdit'],
    }),
    deleteBanner: build.mutation<IResponse<null, any>, number>({
      query: id => {
        return {
          url: `/banners/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: (result, error) => error ? [] : ['bannerDelete'],
    }),
    uploadBannerImage: build.mutation<IResponse<{ src: string }, any>, { id: number, bannerImage: FormData }>({
      query: ({ id, bannerImage }) => {
        return {
          url: `/banners/${id}/image`,
          method: 'POST',
          body: bannerImage,
          formData: true,
        }
      }
    }),
    deleteBannerImage: build.mutation<IResponse<null, any>, number>({
      query: id => {
        return {
          url: `/banners/${id}/image`,
          method: 'DELETE',
        }
      }
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerQuery,
  useEditBannerMutation,
  useDeleteBannerMutation,
  useCreateBannerMutation,
  useUploadBannerImageMutation,
  useDeleteBannerImageMutation,
} = bannerAPI;
