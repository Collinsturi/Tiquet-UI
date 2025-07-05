import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {usersAPI} from "../queries/users/UserQuery.ts";
import {loginApi} from "../features/login/loginApi.ts";
import userSlice from "../features/login/userSlice.ts";


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