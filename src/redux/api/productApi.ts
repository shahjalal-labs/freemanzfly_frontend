/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "./baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewArrivalProducts: builder.query({
      query: ({ sort, page, limit }) => ({
        url: `/products?sort=${sort}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getBestSellingProducts: builder.query({
      query: () => ({
        url: `/order/best-selling`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getAllCategoryProducts: builder.query({
      query: ({ category, page, limit }) => {
        // base query params
        const params: Record<string, any> = { page, limit };

        if (category) {
          params.productCategory = category;
        }

        return {
          url: "/products",
          method: "GET",
          params,
        };
      },
      providesTags: ["Product"],
    }),

    getCategoriesProducts: builder.query({
      query: ({
        startPrice,
        endPrice,
        sort,
        availability,
        brand,
        productCategory,
        page,
        limit,
      }) => {
        const params = new URLSearchParams();

        // required params
        params.append("page", page);
        params.append("limit", limit);

        // optional params (only if provided)
        if (startPrice) params.append("startPrice", startPrice);
        if (endPrice) params.append("endPrice", endPrice);
        if (sort) params.append("sort", sort);
        if (availability) params.append("availability", availability);
        if (brand) params.append("brand", brand);
        if (productCategory) params.append("productCategory", productCategory);

        return {
          url: `/products?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Product"],
    }),

    getAllCategories: builder.query({
      query: () => ({
        url: `/products/categories`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getAllBrands: builder.query({
      query: () => ({
        url: `/products/brands`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getSingleProductDetails: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    getAllProducts: builder.query({
      query: ({ page, limit }) => ({
        url: `/products?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetNewArrivalProductsQuery,
  useGetAllCategoriesQuery,
  useGetBestSellingProductsQuery,
  useGetAllCategoryProductsQuery,
  useGetCategoriesProductsQuery,
  useGetAllBrandsQuery,
  useGetSingleProductDetailsQuery,
  useGetAllProductsQuery
} = productApi;
