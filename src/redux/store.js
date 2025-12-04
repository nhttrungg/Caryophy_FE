import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import merchantReducer from './reducers/merchantReducer';
import cartReducer from "./reducers/cartReducer";
import commonReducer from "./reducers/commonReducer";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'merchant','cart','common'] // Chỉ lưu trữ các reducer này
};

const rootReducer = combineReducers({
    user: userReducer,
    merchant: merchantReducer,
    cart: cartReducer,
    common: commonReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);