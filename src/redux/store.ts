import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {usersAPI} from "../features/users/userApi.ts";
import {loginApi} from "../features/login/loginApi.ts";
import userSlice from "../features/login/userSlice.ts";
import {carsApi} from "../features/Cars/carsApi.ts";
import {reservationsApi} from "../features/reservation/reservationApi.ts";
import {bookingsApi} from "../features/booking/bookingApi.ts";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user']
}

const rootReducer = combineReducers({
    [usersAPI.reducerPath]: usersAPI.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    user: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,


    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
        .concat(usersAPI.middleware)
        .concat(loginApi.middleware)
})

export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof store.getState>