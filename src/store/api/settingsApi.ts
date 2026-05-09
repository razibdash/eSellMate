import type { User } from "@/types/auth";
import type { MessageTemplate } from "@/types/message";
import type { Plan, Subscription, SubscriptionPayment } from "@/types/subscription";
import { baseApi } from "./baseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<User[], void>({ query: () => "/staff", providesTags: ["Staff"] }),
    createStaff: builder.mutation<User, Partial<User>>({ query: (body) => ({ url: "/staff", method: "POST", body }), invalidatesTags: ["Staff"] }),
    updateStaff: builder.mutation<User, { id: string | number; body: Partial<User> }>({ query: ({ id, body }) => ({ url: `/staff/${id}`, method: "PUT", body }), invalidatesTags: ["Staff"] }),
    deleteStaff: builder.mutation<User, string | number>({ query: (id) => ({ url: `/staff/${id}`, method: "DELETE" }), invalidatesTags: ["Staff"] }),

    getMessageTemplates: builder.query<MessageTemplate[], void>({ query: () => "/message-templates", providesTags: ["MessageTemplate"] }),
    createMessageTemplate: builder.mutation<MessageTemplate, Partial<MessageTemplate>>({ query: (body) => ({ url: "/message-templates", method: "POST", body }), invalidatesTags: ["MessageTemplate"] }),

    getPlans: builder.query<Plan[], void>({ query: () => "/plans", providesTags: ["Subscription"] }),
    getSubscription: builder.query<Subscription, void>({ query: () => "/subscription", providesTags: ["Subscription"] }),
    changeSubscription: builder.mutation<Subscription, { plan_id: string | number }>({ query: (body) => ({ url: "/subscription/change", method: "POST", body }), invalidatesTags: ["Subscription"] }),
    addSubscriptionPayment: builder.mutation<{ success: boolean }, Partial<SubscriptionPayment>>({ query: (body) => ({ url: "/subscription/payment", method: "POST", body }), invalidatesTags: ["Subscription"] }),
    getSubscriptionInvoices: builder.query<SubscriptionPayment[], void>({ query: () => "/subscription/invoices", providesTags: ["Subscription"] })
  })
});

export const {
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useGetMessageTemplatesQuery,
  useCreateMessageTemplateMutation,
  useGetPlansQuery,
  useGetSubscriptionQuery,
  useChangeSubscriptionMutation,
  useAddSubscriptionPaymentMutation,
  useGetSubscriptionInvoicesQuery
} = settingsApi;
