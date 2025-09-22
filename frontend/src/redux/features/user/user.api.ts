import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user info
    userInfo: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    // Update user profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    // Set password (for Google users)
    setPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/set-password",
        method: "POST",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    // Change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useLazyUserInfoQuery,
  useUpdateProfileMutation,
  useSetPasswordMutation,
  useChangePasswordMutation,
} = userApi;