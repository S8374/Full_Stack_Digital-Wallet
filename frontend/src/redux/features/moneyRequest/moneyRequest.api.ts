// src/redux/features/moneyRequest/moneyRequest.api.ts
import { baseApi } from "@/redux/baseApi";

export const moneyRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createMoneyRequest: builder.mutation({
            query: (requestData) => ({
                url: "/money-requests/request",
                method: "POST",
                data: requestData,
            }),
            invalidatesTags: ["MoneyRequests"],
        }),

        getMyRequests: builder.query({
            query: (type: 'sent' | 'received') => ({
                url: `/money-requests/requests?type=${type}`,
                method: "GET",
            }),
            providesTags: ["MoneyRequests"],
        }),

        approveRequest: builder.mutation({
            query: (requestId) => ({
                url: `/money-requests/requests/${requestId}/approve`,
                method: "POST",
                data:{}
            }),
            invalidatesTags: ["MoneyRequests", "WALLET"],
        }),

        rejectRequest: builder.mutation({
            query: (requestId) => ({
                url: `/money-requests/requests/${requestId}/reject`,
                method: "POST",
                data:{}
            }),
            invalidatesTags: ["MoneyRequests"],
        }),

        cancelRequest: builder.mutation({
            query: (requestId) => ({
                url: `/money-requests/requests/${requestId}/cancel`,
                method: "POST",
            }),
            invalidatesTags: ["MoneyRequests"],
        }),

        searchUsers: builder.query({
            query: (searchQuery) => ({
                url: `/users/search?q=${encodeURIComponent(searchQuery)}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useCreateMoneyRequestMutation,
    useGetMyRequestsQuery,
    useApproveRequestMutation,
    useRejectRequestMutation,
    useCancelRequestMutation,
    useSearchUsersQuery,
} = moneyRequestApi;