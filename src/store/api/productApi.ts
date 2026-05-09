import type { Category, CategoryPayload, Product, ProductPayload } from "@/types/product";
import { baseApi } from "./baseApi";

export type ProductFilters = {
  search?: string;
  category_id?: string | number;
  status?: string;
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({ query: () => "/categories", providesTags: ["Category"] }),
    createCategory: builder.mutation<Category, CategoryPayload>({ query: (body) => ({ url: "/categories", method: "POST", body }), invalidatesTags: ["Category"] }),
    updateCategory: builder.mutation<Category, { id: string | number; body: Partial<CategoryPayload> }>({ query: ({ id, body }) => ({ url: `/categories/${id}`, method: "PUT", body }), invalidatesTags: ["Category", "Product"] }),
    deleteCategory: builder.mutation<Category, string | number>({ query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }), invalidatesTags: ["Category", "Product"] }),

    getProducts: builder.query<Product[], ProductFilters | void>({ query: (params) => ({ url: "/products", params: params || undefined }), providesTags: ["Product"] }),
    getLowStockProducts: builder.query<Product[], void>({ query: () => "/products/low-stock", providesTags: ["Product", "Stock"] }),
    getProduct: builder.query<Product, string | number>({ query: (id) => `/products/${id}`, providesTags: (_result, _error, id) => [{ type: "Product", id }] }),
    createProduct: builder.mutation<Product, ProductPayload>({ query: (body) => ({ url: "/products", method: "POST", body }), invalidatesTags: ["Product", "Report", "Stock"] }),
    updateProduct: builder.mutation<Product, { id: string | number; body: Partial<ProductPayload> }>({ query: ({ id, body }) => ({ url: `/products/${id}`, method: "PUT", body }), invalidatesTags: (_result, _error, { id }) => [{ type: "Product", id }, "Product", "Report", "Stock"] }),
    deleteProduct: builder.mutation<Product, string | number>({ query: (id) => ({ url: `/products/${id}`, method: "DELETE" }), invalidatesTags: ["Product", "Report", "Stock"] })
  })
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsQuery,
  useGetLowStockProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productApi;
