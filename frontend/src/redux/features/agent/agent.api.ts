// src/redux/features/agent/agent.api.ts
import { baseApi } from "@/redux/baseApi"

export const agentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        cashIn: builder.mutation({
            query: (cashInData) => ({
                url: "/agent/cash-in",
                method: "POST",
                data: cashInData,
            }),
            invalidatesTags: ["WALLET", "TRANSACTION"],
        }),
        cashOut: builder.mutation({
            query: (cashOutData) => ({
                url: "/agent/cash-out",
                method: "POST",
                data: cashOutData,
            }),
            invalidatesTags: ["WALLET", "TRANSACTION"],
        }),
        searchUsers: builder.query({
            query: (searchQuery) => ({
                url: `/users/search?q=${encodeURIComponent(searchQuery)}`,
                method: "GET",
            }),
        }),
        getAllUser: builder.query({
            query: () => ({
                url: `/admin/users`,
                method: "GET",
            }),
            providesTags: ["USER"],
        }),
        requestToBecomeAgent: builder.mutation({
            query: () => ({
                url: "/agent/request-agent",
                method: "POST",
            }),
            invalidatesTags: ["USER"],
        }),

        // Cancel agent request
        cancelAgentRequest: builder.mutation({
            query: () => ({
                url: "/agent/cancel-agent-request",
                method: "POST",
            }),
            invalidatesTags: ["USER"],
        }),

    })
})

export const {
    useCashInMutation,
    useCashOutMutation,
    useSearchUsersQuery,
    useLazySearchUsersQuery,
    useGetAllUserQuery,
    useRequestToBecomeAgentMutation,
    useCancelAgentRequestMutation,
} = agentApi