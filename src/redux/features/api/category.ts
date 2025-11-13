import { getCategories } from '@/sanity/sanity-shop-utils';
import type { Category } from '@/types/category';
import { createRtkErrorResult } from '@/utils/error-handler';
import { productApi } from './product';

export const categoryApi = productApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      queryFn: async () => {
        try {
          const categories = await getCategories();
          return { data: categories };
        } catch (error) {
          return createRtkErrorResult(error);
        }
      },
      providesTags: ['category'],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
