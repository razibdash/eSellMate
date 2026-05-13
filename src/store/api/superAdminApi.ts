import { baseApi } from "./baseApi";

export const superAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminDashboard: builder.query<Record<string, number>, void>({
      query: () => "/super-admin/dashboard",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminBusinesses: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/businesses",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminUsers: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/users",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminPlans: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/plans",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminSubscriptions: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/subscriptions",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminStorefronts: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/storefronts",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminProducts: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/products",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminOrders: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/orders",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminPayments: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/payments",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminReports: builder.query<Record<string, unknown>, void>({
      query: () => "/super-admin/reports",
      providesTags: ["SuperAdmin"],
    }),
    getSuperAdminSubscriptionPayments: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/subscription-payments",
      providesTags: ["SuperAdmin"],
    }),
    approveSubscriptionPayment: builder.mutation<Record<string, unknown>, string | number>({
      query: (id) => ({ url: `/super-admin/subscription-payments/${id}/approve`, method: "POST" }),
      invalidatesTags: ["SuperAdmin"],
    }),
    rejectSubscriptionPayment: builder.mutation<Record<string, unknown>, { id: string | number; note?: string }>({
      query: ({ id, note }) => ({ url: `/super-admin/subscription-payments/${id}/reject`, method: "POST", body: { note } }),
      invalidatesTags: ["SuperAdmin"],
    }),
    getSuperAdminLogs: builder.query<Record<string, unknown>[], void>({
      query: () => "/super-admin/logs",
      providesTags: ["SuperAdmin"],
    }),
  }),
});

export const {
  useGetSuperAdminDashboardQuery,
  useGetSuperAdminBusinessesQuery,
  useGetSuperAdminUsersQuery,
  useGetSuperAdminPlansQuery,
  useGetSuperAdminSubscriptionsQuery,
  useGetSuperAdminStorefrontsQuery,
  useGetSuperAdminProductsQuery,
  useGetSuperAdminOrdersQuery,
  useGetSuperAdminPaymentsQuery,
  useGetSuperAdminReportsQuery,
  useGetSuperAdminSubscriptionPaymentsQuery,
  useApproveSubscriptionPaymentMutation,
  useRejectSubscriptionPaymentMutation,
  useGetSuperAdminLogsQuery,
} = superAdminApi;
