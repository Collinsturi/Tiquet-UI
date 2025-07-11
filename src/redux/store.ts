import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {AuthQuery} from "../queries/general/AuthQuery.ts";
import ApplicationUserSlice from "../queries/general/ApplicationUserSlice.ts";


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user']
}

const rootReducer = combineReducers({
    [AuthQuery.reducerPath]: AuthQuery.reducer,
    user: ApplicationUserSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,


    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
        .concat(AuthQuery.middleware)
})

export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof store.getState>