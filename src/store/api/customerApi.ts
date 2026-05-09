import type { Customer, CustomerPayload } from "@/types/customer";
import type { Order } from "@/types/order";
import { baseApi } from "./baseApi";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], { search?: string } | void>({ query: (params) => ({ url: "/customers", params: params || undefined }), providesTags: ["Customer"] }),
    getCustomer: builder.query<Customer, string | number>({ query: (id) => `/customers/${id}`, providesTags: (_result, _error, id) => [{ type: "Customer", id }] }),
    createCustomer: builder.mutation<Customer, CustomerPayload>({ query: (body) => ({ url: "/customers", method: "POST", body }), invalidatesTags: ["Customer"] }),
    updateCustomer: builder.mutation<Customer, { id: string | number; body: Partial<CustomerPayload> }>({ query: ({ id, body }) => ({ url: `/customers/${id}`, method: "PUT", body }), invalidatesTags: (_result, _error, { id }) => [{ type: "Customer", id }, "Customer"] }),
    deleteCustomer: builder.mutation<Customer, string | number>({ query: (id) => ({ url: `/customers/${id}`, method: "DELETE" }), invalidatesTags: ["Customer"] }),
    getCustomerOrders: builder.query<Order[], string | number>({ query: (id) => `/customers/${id}/orders`, providesTags: ["Order"] })
  })
});

export const { useGetCustomersQuery, useGetCustomerQuery, useCreateCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation, useGetCustomerOrdersQuery } = customerApi;
