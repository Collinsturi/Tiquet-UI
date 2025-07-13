import {createSlice} from "@reduxjs/toolkit";

export type UserState = {
    token: string | null;
    user: {
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    } | null;
}


const initialState: UserState = {
    token: null,
    user: null,
}

const ApplicationUserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
        }
    }
})

export const { loginSuccess, logout } = ApplicationUserSlice.actions;
export default ApplicationUserSlice.reducer;