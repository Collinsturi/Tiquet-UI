import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {UserQuery} from "../queries/users/UserQuery.ts";
import {LoginQuery} from "../queries/login/LoginQuery.ts";
import userSlice from "../queries/login/UserSlice.ts";


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user']
}

const rootReducer = combineReducers({
    [UserQuery.reducerPath]: UserQuery.reducer,
    [LoginQuery.reducerPath]: LoginQuery.reducer,
    user: userSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,


    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
        .concat(UserQuery.middleware)
        .concat(LoginQuery.middleware)
})

export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof store.getState>