import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Auth"]
    }),
    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      invalidatesTags: ["Auth"]
    }),
    me: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"]
    }),
    logoutRequest: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"]
    }),
    forgotPassword: builder.mutation<{ success: boolean; message?: string }, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body })
    }),
    resetPassword: builder.mutation<{ success: boolean }, { token: string; password: string }>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body })
    })
  })
});

export const { useLoginMutation, useRegisterMutation, useMeQuery, useLogoutRequestMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi;
