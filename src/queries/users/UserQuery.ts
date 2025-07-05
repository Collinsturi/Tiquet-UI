import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ApiDomain} from "../../utils/apiSettings.ts";
import type {RootState} from "../../redux/store.ts";

export type TUser = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    // password: varchar('password').notNull(),
    contactPhone: string,
    address: string,
    role: string,
    verificationCode: number,
    isVerified: boolean,
    // createdAt: date,
};

export const UserQuery = createApi({
    reducerPath: 'UserQuery',
    baseQuery: fetchBaseQuery({
        baseUrl: ApiDomain,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        }
    }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        createUsers: builder.mutation<TUser, Partial<TUser>>({
            query: (newUser) => ({
                url: '/auth/register',
                method: 'POST',
                body: newUser
            }),
            invalidatesTags: ['Users'] // invalidates the cache for the Users tag when a new user is created
        }),
        verifyUser: builder.mutation<{ message: string }, { email: string; code: string }>({
            query: (data) => ({
                url: '/auth/verify',
                method: 'POST',
                body: data,
            }),
        }),
        getUsers: builder.query<TUser[], void>({
            query: () => '/auth/users',
            providesTags: ['Users']
        }),
        // update user
        updateUser: builder.mutation<TUser, Partial<TUser> & { id: number }>({
            query: (user) => ({
                url: `/auth/user/${user.id}`,
                method: 'PUT',
                body: user,
            }),
            invalidatesTags: ['Users']
        }),
        getUserById: builder.query<TUser, number>({
            query: (id) => `/auth/user/${id}`,
        }),
        updateUserByRole: builder.mutation<TUser, Partial<TUser> & { id: number, role: string}>({
            query: (user) => ({
                url: `/auth/user/role`,
                method: 'PUT',
                body: {
                    id: user.id,
                    role: user.role
                }
            }),
            invalidatesTags: ['Users']
        })
    })
})