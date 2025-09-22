// src/redux/features/auth/auth.api.ts
import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                data: userInfo,
            }),
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/users/register",
                method: "POST",
                data: userInfo,
            }),
        }),
        sendOTP: builder.mutation({
            query: (emailData) => ({
                url: "/otp/send",
                method: "POST",
                data: emailData,
            }),
        }),
        verifyOTP: builder.mutation({
            query: (otpData) => ({
                url: "/otp/verify",
                method: "POST",
                data: otpData,
            }),
        }),
        // Add Google login endpoint
        getGoogleAuthUrl: builder.query({
            query: () => ({
                url: "/auth/google",
                method: "GET",
            }),
        }),
        userInfo: builder.query({
            query: () => ({
                url: "/users/me",
                method: "GET",
            }),
            providesTags: ["USER"],
        }),
        forgetPassword: builder.mutation({
            query: (data) => ({
                url: "/auth/forgot-password",
                method: "POST",
                data,
            }),
        }),

        resetPassword: builder.mutation({
            query: (data) => ({
                url: "/auth/reset-password",
                method: "POST",
                data
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["USER"],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useSendOTPMutation,
    useVerifyOTPMutation,
    useGetGoogleAuthUrlQuery,
    useUserInfoQuery,
    useForgetPasswordMutation,
    useResetPasswordMutation,
   useLogoutMutation
} = authApi;