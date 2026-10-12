import baseApi from "./baseApi";

const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    storeShippingAddress: builder.mutation({
      query: (data) => ({
        url: `/shippingAddress`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shipping"],
    }),

    getMyShippingAddress: builder.query({
      query: () => ({
        url: `/shippingAddress`,
        method: "GET",
      }),
      providesTags: ["shipping"],
    }),

    editShippingAddress: builder.mutation({
      query: ({ id, data }) => ({
        url: `/shippingAddress/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["shipping"],
    }),

    deleteShippingAddress: builder.mutation({
      query: (id) => ({
        url: `/shippingAddress/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["shipping"],
    }),

    calculateCouponDiscount: builder.mutation({
      query: (data) => ({
        url: `/order/calculate-discount`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shipping"],
    }),

      getShippingCost: builder.query({
      query: () => ({
        url: `/order/shipping/charge`,
        method: "GET",
      }),
      providesTags: ["shipping"],
    }),
      getAllCoupons: builder.query({
      query: ({page, limit}) => ({
        url: `/coupons?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["shipping"],
    }),
  }),
});

export const {
  useStoreShippingAddressMutation,
  useGetMyShippingAddressQuery,
  useEditShippingAddressMutation,
  useDeleteShippingAddressMutation,
  useCalculateCouponDiscountMutation,
  useGetShippingCostQuery,
  useGetAllCouponsQuery,
} = shippingApi;
