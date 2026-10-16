import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import type { IRestaurant } from "../../types";
import { restaurantService } from "../../main";

interface RestaurantState {
    restaurant: IRestaurant | null;
    loading: boolean;
    error: string | null;
}

const initialState: RestaurantState = {
    restaurant: null,
    loading: true,
    error: null,
};

export const fetchRestaurant = createAsyncThunk("restaurant/fetchRestaurant", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Authentication required");
        }

        const { data } = await axios.get(
            `${restaurantService}/api/restaurant/`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // If backend sends a refreshed token
        if (data.token) {
            localStorage.setItem("token", data.token);
        }

        return data.restaurant as IRestaurant;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch restaurant"
            );
        }

        return rejectWithValue(
            "Failed to fetch restaurant"
        );
    }
});

const restaurantSlice = createSlice({
    name: "restaurant",

    initialState,

    reducers: {
        setRestaurant: (state, action: PayloadAction<IRestaurant | null>) => {
            state.restaurant = action.payload;
        },

        clearRestaurant: (state) => {
            state.restaurant = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchRestaurant.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurant = action.payload;
                state.error = null;
            })

            .addCase(fetchRestaurant.rejected, (state, action) => {
                state.loading = false;
                state.restaurant = null;
                state.error = action.payload as string;
            });
    },
});

export const { setRestaurant, clearRestaurant, } = restaurantSlice.actions;

export default restaurantSlice.reducer;