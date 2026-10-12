import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL_LOCAL,
    // baseUrl: "https://b769-182-252-68-225.ngrok-free.app/api",
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");

      if (token) {
        headers.set("Authorization", `${token}`);
      } 
      // hello
      return headers; 
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["User", "about", "Product", "blogs", "contact", "shipping"],
});

export default baseApi;
