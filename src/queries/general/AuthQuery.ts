import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../APIConfiguration.ts";

export type TLoginResponse = {
    token: string,
    user: {
        user_id: number,
        first_name: string,
        last_name: string,
        email: string,
        role: string
    }
}

type LoginRequest = {
    email: string,
    password: string,
}

export type RegisterRequest = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    // Note: confirmPassword is a frontend-only validation, not typically sent to the backend
};

export type TRegisterResponse = {
    message: string; // Or TLoginResponse if it logs in automatically
    // Include user data if the API returns it after registration
    user?: {
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    };
};

export type TVerificationRequest = {
    email: string,
    code: number
}

export type TVerificationResponse = {
    message: string;
}

export type ApplicationUser ={
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    contactPhone: string,
    address: string,
    role: string,
    isVerified: boolean,
    createdAt: string,
}

export const AuthQuery = createApi({
    reducerPath: 'LoginQuery',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Login', 'Register', 'verification', `ApplicationUser`],
    endpoints: (builder) => ({
        loginUser: builder.mutation<TLoginResponse, LoginRequest>({
            query: (loginData) => ({
                url: '/auth/login',
                method: 'POST',
                body: loginData
            }),
            invalidatesTags: ['Login']
        }),

        registerUser: builder.mutation<TRegisterResponse, RegisterRequest>({
            query: (registerData) => ({
                url: '/auth/register',
                method: 'POST',
                body: registerData
            }),
            invalidatesTags: ['Register']
        }),

        verification: builder.mutation<TVerificationResponse, TVerificationRequest>({
            query: (verificationRequest) => ({
                url: '/auth/verify',
                method: 'POST',
                body: verificationRequest
            }),
            invalidatesTags: ['verification']
        }),
        getUserDetails: builder.query<ApplicationUser, number>({
            query: (id) =>({
                url: `/auth/user/${id}`,
                method: 'GET'
            }),
            invalidateTags: [`ApplicationUser`]
        })
    })
})

export const {
    useLoginUserMutation,
    useRegisterUserMutation,
    useVerificationMutation,
    useGetUserDetailsQuery,
} = AuthQuery