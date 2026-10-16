import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import locationReducer from "./slices/locationSlice";
import restaurantReducer from "./slices/restaurantSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        location: locationReducer,
        restaurant: restaurantReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


