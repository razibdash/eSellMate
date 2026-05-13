import type { User } from "@/types/auth";
import type { MessageTemplate } from "@/types/message";
import type {
  CheckoutPayload,
  CheckoutResponse,
  Plan,
  Subscription,
  SubscriptionPayment,
} from "@/types/subscription";
import { baseApi } from "./baseApi";

type StaffMembership = {
  id: string | number;
  status: User["status"];
  user?: User;
  role?: { code?: User["role"] };
};

export type StaffPayload = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role_code?: User["role"];
  status?: User["status"];
};

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<User[], void>({
      query: () => "/staff",
      transformResponse: (response: StaffMembership[]) =>
        response.map((membership) => ({
          ...(membership.user as User),
          id: membership.id,
          role: membership.role?.code ?? membership.user?.role ?? "staff",
          permissions: membership.user?.permissions ?? [],
          status: membership.status ?? membership.user?.status ?? "active",
        })),
      providesTags: ["Staff"],
    }),
    createStaff: builder.mutation<User, StaffPayload>({
      query: (body) => ({ url: "/staff", method: "POST", body }),
      invalidatesTags: ["Staff"],
    }),
    updateStaff: builder.mutation<
      User,
      { id: string | number; body: StaffPayload }
    >({
      query: ({ id, body }) => ({ url: `/staff/${id}`, method: "PUT", body }),
      invalidatesTags: ["Staff"],
    }),
    deleteStaff: builder.mutation<User, string | number>({
      query: (id) => ({ url: `/staff/${id}`, method: "DELETE" }),
      invalidatesTags: ["Staff"],
    }),

    getMessageTemplates: builder.query<MessageTemplate[], void>({
      query: () => "/message-templates",
      providesTags: ["MessageTemplate"],
    }),
    createMessageTemplate: builder.mutation<
      MessageTemplate,
      Partial<MessageTemplate>
    >({
      query: (body) => ({ url: "/message-templates", method: "POST", body }),
      invalidatesTags: ["MessageTemplate"],
    }),

    getPlans: builder.query<Plan[], void>({
      query: () => "/plans",
      transformResponse: (response: Plan[]) =>
        response.map((plan) => ({
          ...plan,
          features: Array.isArray(plan.features)
            ? plan.features
            : Object.entries(plan.features_json || {}).map(([key, value]) =>
                value === true ? key.replaceAll("_", " ") : `${key.replaceAll("_", " ")}: ${String(value)}`,
              ),
        })),
      providesTags: ["Subscription"],
    }),
    getSubscription: builder.query<Subscription, void>({
      query: () => "/subscription",
      providesTags: ["Subscription"],
    }),
    checkoutSubscription: builder.mutation<CheckoutResponse, CheckoutPayload>({
      query: (body) => ({ url: "/subscription/checkout", method: "POST", body }),
      invalidatesTags: ["Subscription"],
    }),
    verifySubscriptionPayment: builder.mutation<
      SubscriptionPayment,
      string | number
    >({
      query: (id) => ({ url: `/subscription/payments/${id}/verify`, method: "POST" }),
      invalidatesTags: ["Subscription"],
    }),
    getSubscriptionInvoices: builder.query<SubscriptionPayment[], void>({
      query: () => "/subscription/invoices",
      providesTags: ["Subscription"],
    }),
  }),
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
  useCheckoutSubscriptionMutation,
  useVerifySubscriptionPaymentMutation,
  useGetSubscriptionInvoicesQuery,
} = settingsApi;
