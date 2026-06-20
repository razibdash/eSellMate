import type {
  AddPaymentPayload,
  AddPaymentResult,
  Invoice,
  Order,
  OrderPayload,
  OrderStatus,
  PaymentStatus,
  DeliveryStatus,
} from "@/types/order";
import type { SmsLog } from "@/types/sms";
import { baseApi } from "./baseApi";

export type OrderFilters = {
  search?: string;
  status?: string;
  source?: string;
};

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], OrderFilters | void>({
      query: (params) => ({
        url: "/orders",
        params: params
          ? {
              q: params.search,
              order_status: params.status,
              order_source: params.source,
            }
          : undefined,
      }),
      providesTags: ["Order"],
    }),
    getOrder: builder.query<Order, string | number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    createOrder: builder.mutation<Order, OrderPayload>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Order", "Product", "Customer", "Report", "Stock"],
    }),
    updateOrder: builder.mutation<
      Order,
      { id: string | number; body: OrderPayload }
    >({
      query: ({ id, body }) => ({ url: `/orders/${id}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        "Order",
        "Report",
        "Stock",
      ],
    }),
    cancelOrder: builder.mutation<Order, string | number>({
      query: (id) => ({ url: `/orders/${id}`, method: "DELETE" }),
      invalidatesTags: ["Order", "Report", "Stock"],
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { id: string | number; status: OrderStatus }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        body: { order_status: status },
      }),
      invalidatesTags: ["Order", "Report", "Stock"],
    }),
    updatePaymentStatus: builder.mutation<
      Order,
      { id: string | number; status: PaymentStatus }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/payment-status`,
        method: "PUT",
        body: { payment_status: status },
      }),
      invalidatesTags: ["Order", "Report"],
    }),
    updateDeliveryStatus: builder.mutation<
      Order,
      { id: string | number; status: DeliveryStatus }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/delivery-status`,
        method: "PUT",
        body: { delivery_status: status },
      }),
      invalidatesTags: ["Order", "Report"],
    }),
    addPayment: builder.mutation<
      AddPaymentResult,
      { id: string | number; body: AddPaymentPayload }
    >({
      query: ({ id, body }) => ({
        url: `/orders/${id}/payments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Order", id }, "Order", "Report"],
    }),
    resendSms: builder.mutation<SmsLog, string | number>({
      query: (id) => ({ url: `/orders/${id}/resend-sms`, method: "POST" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Order", id }, "Order"],
    }),
    getInvoice: builder.query<Invoice, string | number>({
      query: (id) => `/orders/${id}/invoice`,
      providesTags: ["Invoice"],
    }),
    generateInvoice: builder.mutation<Invoice, string | number>({
      query: (id) => ({
        url: `/orders/${id}/invoice/generate`,
        method: "POST",
      }),
      invalidatesTags: ["Invoice", "Order"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useUpdateDeliveryStatusMutation,
  useAddPaymentMutation,
  useResendSmsMutation,
  useGetInvoiceQuery,
  useGenerateInvoiceMutation,
} = orderApi;
