// src/redux/features/payment/payment.api.ts
import { baseApi } from "@/redux/baseApi"

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyPayment: builder.mutation({
      query: (verificationData) => ({
        url: "/payment/verify",
        method: "POST",
        data: verificationData,
      }),
    }),
    getCancelPayment: builder.query({
      query: () => ({
        url: "/payment/my-cancelled-payments",
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),
    getCompletePayment: builder.query({
      query: () => ({
        url: "/payment/my-complete-payments",
        method: "GET",
      }),
      providesTags: ["PAYMENT"],
    }),
    getMyTransaction: builder.query({
      query: () => ({
        url: "/payment/my-transaction",
        method: "GET",
      }),
      providesTags: ["TRANSACTION"],
    }),
    retryPayment: builder.mutation({
      query: (paymentId) => ({
        url: `/payment/retry-payment/${paymentId}`,
        method: "POST",
      }),
      invalidatesTags: ["PAYMENT", "TRANSACTION"],
    }),
  })
})

export const {
  useVerifyPaymentMutation,
  useGetCancelPaymentQuery,
  useGetMyTransactionQuery,
  useGetCompletePaymentQuery,
  useRetryPaymentMutation
} = paymentApi;