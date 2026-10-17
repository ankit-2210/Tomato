import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/Auth/authSlice";
import locationReducer from "./slices/Location/locationSlice";
import restaurantReducer from "./slices/Restaurant/restaurantSlice";
import menuItemReducer from "./slices/Menu/menuItemSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        location: locationReducer,
        restaurant: restaurantReducer,
        menuItem: menuItemReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


