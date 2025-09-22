// src/redux/features/wallet/wallet.api.ts
import { baseApi } from "@/redux/baseApi"

export const walletApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyWallet: builder.query({
            query: () => ({
                url: "/users/getWallet",
                method: "GET",
            }),
            providesTags: ["WALLET"],
        }),
        addMoney: builder.mutation({
            query: (paymentData) => ({
                url: "/wallet/add-money",
                method: "POST",
                data: paymentData,
            }),
            invalidatesTags: ["WALLET"],
        }),
        withdrawMoney: builder.mutation({
            query: (withdrawData) => ({
                url: "/wallet/withdraw",
                method: "POST",
                data: withdrawData,
            }),
            invalidatesTags: ["WALLET"],
        }),
        sendMoney: builder.mutation({
            query: (data) => ({
                url: '/users/send-money',
                method: 'POST',
                data: data,
            }),
            invalidatesTags: ['WALLET'],
        }),
        getUserWallet: builder.query({
            query: (userId) => ({
                url: `/users/${userId}/wallet`,
                method: "GET",
            }),
            providesTags: ["WALLET"],
        })
    })
})

export const {
    useGetMyWalletQuery,
    useAddMoneyMutation,
    useWithdrawMoneyMutation,
    useSendMoneyMutation,
    useGetUserWalletQuery
} = walletApi