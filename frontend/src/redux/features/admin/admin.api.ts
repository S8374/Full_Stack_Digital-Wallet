// src/redux/features/admin/admin.api.ts
import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ------------------ User management ------------------
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/admin/users",
        method: "GET",
        params,
      }),
      providesTags: ["USERS"],
    }),

    getUserById: builder.query({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["USERS", "USER"],
    }),

    // ------------------ Agent management ------------------
    getAllAgents: builder.query({
      query: () => ({
        url: "/admin/agents",
        method: "GET",
      }),
      providesTags: ["AGENTS"],
    }),

    getPendingAgents: builder.query({
      query: () => ({
        url: "/admin/agents/pending",
        method: "GET",
      }),
      providesTags: ["AGENTS"],
    }),

    getAgentById: builder.query({
      query: (agentId) => ({
        url: `/admin/agents/${agentId}`,
        method: "GET",
      }),
      providesTags: ["AGENT"],
    }),

    updateAgentStatus: builder.mutation({
      query: ({ agentId, status }) => ({
        url: `/admin/agents/${agentId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["AGENTS", "AGENT"],
    }),

    // ------------------ Wallet management ------------------
    getAllWallets: builder.query({
      query: () => ({
        url: "/admin/wallets",
        method: "GET",
      }),
      providesTags: ["WALLETS"],
    }),

    getWalletByUserId: builder.query({
      query: (userId) => ({
        url: `/admin/wallets/${userId}`,
        method: "GET",
      }),
      providesTags: ["WALLET"],
    }),

    updateWalletStatus: builder.mutation({
      query: ({ walletId, status }) => ({
        url: `/admin/wallets/${walletId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["WALLETS", "WALLET"],
    }),

    // ------------------ Transaction management ------------------
    getAllTransactions: builder.query({
      query: (params) => ({
        url: "/admin/transactions",
        method: "GET",
        params,
      }),
      providesTags: ["TRANSACTION"],
    }),

    getTransactionById: builder.query({
      query: (transactionId) => ({
        url: `/admin/transactions/${transactionId}`,
        method: "GET",
      }),
      providesTags: ["TRANSACTION"],
    }),

    // ------------------ Statistics ------------------
    getUserStatistics: builder.query({
      query: () => ({
        url: "/admin/statistics/users",
        method: "GET",
      }),
      providesTags: ["Statistics"],
    }),

    getSystemStatistics: builder.query({
      query: () => ({
        url: "/admin/statistics/system",
        method: "GET",
      }),
      providesTags: ["Statistics"],
    }),
  }),
});

export const {
  // Users
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,

  // Agents
  useGetAllAgentsQuery,
  useGetPendingAgentsQuery,
  useGetAgentByIdQuery,
  useUpdateAgentStatusMutation,

  // Wallets
  useGetAllWalletsQuery,
  useGetWalletByUserIdQuery,
  useUpdateWalletStatusMutation,

  // Transactions
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,

  // Statistics
  useGetUserStatisticsQuery,
  useGetSystemStatisticsQuery,
} = adminApi;
