import baseApi from "./baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    cancelOrder: builder.mutation({
      query: (data) => ({
        url: `/order/cancel-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shipping"],
    }),
    getMyOrders: builder.query({
      query: ({ page, limit }) => ({
        url: `/order/my-orders?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["shipping"],
    }),

    cancelMyOrders: builder.query({
      query: ({ page, limit, status }) => ({
        url: `/order/my-orders?page=${page}&limit=${limit}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["shipping"],
    }),

    sendReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/review/create/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shipping"],
    }),

    orderCashOnDelivery: builder.mutation({
      query: (data) => ({
        url: `/order/cashOnDelivary`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shipping"],
    }),

    orderOnlinePayment: builder.mutation({
      query: (data) => ({
        url: `/order/order-payment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shipping"],
    }),
  }),
});

export const {
  useCancelOrderMutation,
  useGetMyOrdersQuery,
  useCancelMyOrdersQuery,
  useSendReviewMutation,
  useOrderCashOnDeliveryMutation,
  useOrderOnlinePaymentMutation,
} = orderApi;
