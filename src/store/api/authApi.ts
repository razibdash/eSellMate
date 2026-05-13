import type {
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
  ProfilePayload,
  RegisterPayload,
  User,
} from "@/types/auth";
import { baseApi } from "./baseApi";

function normalizeUser(
  user: User & {
    is_super_admin?: boolean;
    businesses?: Array<{ pivot?: { status?: string } }>;
  },
): User {
  const isSuperAdmin = Boolean(user.is_super_admin);

  return {
    ...user,
    role: isSuperAdmin ? "super_admin" : user.role ?? "viewer",
    permissions: user.permissions ?? (isSuperAdmin ? ["super_admin"] : []),
    status: user.status ?? "active",
  };
}

function normalizeAuthResponse(response: AuthResponse): AuthResponse {
  return {
    ...response,
    user: normalizeUser(response.user),
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { login: email, password, device_name: "web" },
      }),
      transformResponse: normalizeAuthResponse,
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...body, password_confirmation: body.password },
      }),
      transformResponse: normalizeAuthResponse,
      invalidatesTags: ["Auth"],
    }),
    me: builder.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: User) => normalizeUser(response),
      providesTags: ["Auth"],
    }),
    updateProfile: builder.mutation<User, ProfilePayload>({
      query: (body) => ({ url: "/auth/profile", method: "PUT", body }),
      transformResponse: (response: User) => normalizeUser(response),
      invalidatesTags: ["Auth"],
    }),
    uploadAvatar: builder.mutation<User, FormData>({
      query: (body) => ({ url: "/auth/profile/avatar", method: "POST", body }),
      transformResponse: (response: User) => normalizeUser(response),
      invalidatesTags: ["Auth"],
    }),
    changePassword: builder.mutation<{ success: boolean }, ChangePasswordPayload>({
      query: (body) => ({ url: "/auth/password", method: "PUT", body }),
    }),
    logoutRequest: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation<
      { success: boolean; message?: string },
      { email: string }
    >({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation<
      { success: boolean },
      { token: string; password: string }
    >({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useLogoutRequestMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
