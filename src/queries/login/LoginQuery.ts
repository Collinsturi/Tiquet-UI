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

export const LoginQuery = createApi({
    reducerPath: 'LoginQuery',
    baseQuery: fetchBaseQuery({ baseUrl: ApiDomain }),
    tagTypes: ['Login'],
    endpoints: (builder) => ({
        loginUser: builder.mutation<TLoginResponse, LoginRequest>({
            query: (loginData) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: loginData
            }),
            invalidatesTags: ['Login']
        })
    })
})