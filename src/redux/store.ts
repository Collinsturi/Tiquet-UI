import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {AuthQuery} from "../queries/general/AuthQuery.ts";
import ApplicationUserSlice from "../queries/general/ApplicationUserSlice.ts";
import {TicketQuery} from "../queries/eventAttendees/TicketQuery.ts";
import {EventQuery} from "../queries/general/EventQuery.ts"
import {StaffScannedQuery} from "../queries/checkInStaff/StaffScannedQuery.ts";
import { AdminQuery } from '../queries/admin/adminQuery.ts';
import {OrderQuery} from '../queries/eventAttendees/OrderQuery.ts';
import {PaymentQuery} from "../queries/payment/PaymentQuery.ts";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user']
}

const rootReducer = combineReducers({
    [AuthQuery.reducerPath]: AuthQuery.reducer,
    [TicketQuery.reducerPath]: TicketQuery.reducer,
    [EventQuery.reducerPath]: EventQuery.reducer,
    [StaffScannedQuery.reducerPath]: StaffScannedQuery.reducer,
    [AdminQuery.reducerPath]: AdminQuery.reducer,
    [OrderQuery.reducerPath]: OrderQuery.reducer,
    [PaymentQuery.reducerPath]: PaymentQuery.reducer,
    user: ApplicationUserSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,


    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
        .concat(AuthQuery.middleware)
        .concat(TicketQuery.middleware)
        .concat(EventQuery.middleware)
        .concat(StaffScannedQuery.middleware)
        .concat(AdminQuery.middleware)
        .concat(OrderQuery.middleware)
        .concat(PaymentQuery.middleware)
})

export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof store.getState>