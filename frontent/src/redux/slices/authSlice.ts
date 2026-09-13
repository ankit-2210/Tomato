import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { User } from "../../types";
import { authService } from "../../main";

interface AuthState {
    user: User | null;
    isAuth: boolean;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuth: false,
    loading: true,
};


export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return rejectWithValue("No token found");
        }

        const { data } = await axios.get(`${authService}/api/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user"
            );
        }

        return rejectWithValue("Failed to fetch user");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuth = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuth = false;

            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload) {
                    state.user = action.payload;
                    state.isAuth = true;
                }
                else {
                    state.user = null;
                    state.isAuth = false;
                }
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuth = false;
            });
    }

})

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
