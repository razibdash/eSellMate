import { baseApi } from "./baseApi";

export const superAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminDashboard: builder.query<Record<string, number>, void>({ query: () => "/super-admin/dashboard", providesTags: ["SuperAdmin"] }),
    getSuperAdminBusinesses: builder.query<Record<string, unknown>[], void>({ query: () => "/super-admin/businesses", providesTags: ["SuperAdmin"] }),
    getSuperAdminUsers: builder.query<Record<string, unknown>[], void>({ query: () => "/super-admin/users", providesTags: ["SuperAdmin"] }),
    getSuperAdminPlans: builder.query<Record<string, unknown>[], void>({ query: () => "/super-admin/plans", providesTags: ["SuperAdmin"] }),
    getSuperAdminSubscriptions: builder.query<Record<string, unknown>[], void>({ query: () => "/super-admin/subscriptions", providesTags: ["SuperAdmin"] }),
    getSuperAdminLogs: builder.query<Record<string, unknown>[], void>({ query: () => "/super-admin/logs", providesTags: ["SuperAdmin"] })
  })
});

export const { useGetSuperAdminDashboardQuery, useGetSuperAdminBusinessesQuery, useGetSuperAdminUsersQuery, useGetSuperAdminPlansQuery, useGetSuperAdminSubscriptionsQuery, useGetSuperAdminLogsQuery } = superAdminApi;
