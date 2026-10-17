import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import type { IRestaurant } from "../../../types";
import { restaurantService } from "../../../main";

// --------------------------------------------------
// Types
// --------------------------------------------------

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface RestaurantState {
    restaurant: IRestaurant | null;
    restaurants: IRestaurant[];
    selectedRestaurant: IRestaurant | null;
    searchResults: IRestaurant[];
    pagination: Pagination;
    loading: boolean;
    listLoading: boolean;
    actionLoading: boolean;
    error: string | null;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    restaurant?: T;
    restaurants?: T[];
    pagination?: Pagination;
}

interface EditRestaurantPayload {
    name: string;
    description?: string;
}

interface FetchRestaurantsParams {
    page?: number;
    limit?: number;
}

interface SearchRestaurantsParams {
    name: string;
    page?: number;
    limit?: number;
}

interface ApiErrorResponse {
    message?: string;
}

const initialPagination: Pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
};

const initialState: RestaurantState = {
    restaurant: null,
    restaurants: [],
    selectedRestaurant: null,
    searchResults: [],
    pagination: initialPagination,
    loading: false,
    listLoading: false,
    actionLoading: false,
    error: null,
};


// --------------------------------------------------
// Helpers
// --------------------------------------------------

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication required. Please log in.");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

const getErrorMessage = (
    error: unknown,
    fallback: string
): string => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
};


// Fetch seller's restaurant
// GET /api/restaurant/
export const fetchRestaurant = createAsyncThunk<
    IRestaurant,
    void,
    { rejectValue: string }
>("restaurant/fetchRestaurant", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<ApiResponse<IRestaurant>>(
            `${restaurantService}/api/restaurant/`,
            {
                headers: getAuthHeaders()
            }
        );

        if (!data.restaurant) {
            return rejectWithValue("Restaurant data was not returned.");
        }

        return data.restaurant;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to fetch your restaurant.")
        );
    }
});



// Add restaurant
// POST /api/restaurant/add
export const addRestaurant = createAsyncThunk<
    IRestaurant, FormData,
    { rejectValue: string }
>("restaurant/addRestaurant", async (formData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post<ApiResponse<IRestaurant>>(
            `${restaurantService}/api/restaurant/add`,
            formData,
            {
                headers: getAuthHeaders()
            }
        );

        if (!data.restaurant) {
            return rejectWithValue("Restaurant data was not returned.");
        }

        return data.restaurant;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to create restaurant.")
        );
    }
});


// Edit restaurant
// PATCH /api/restaurant/edit
export const editRestaurant = createAsyncThunk<
    IRestaurant, EditRestaurantPayload,
    { rejectValue: string }
>("restaurant/editRestaurant", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axios.patch<ApiResponse<IRestaurant>>(
            `${restaurantService}/api/restaurant/edit`,
            {
                name: payload.name.trim(),
                description: payload.description?.trim() ?? "",
            },
            {
                headers: getAuthHeaders()
            }
        );

        if (!data.restaurant) {
            return rejectWithValue("Updated restaurant was not returned.");
        }

        return data.restaurant;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to update restaurant.")
        );
    }
});


// Toggle restaurant status
// PATCH /api/restaurant/toggle-open
export const toggleRestaurantStatus = createAsyncThunk<
    IRestaurant,
    void,
    { rejectValue: string }
>("restaurant/toggleRestaurantStatus", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.patch<ApiResponse<IRestaurant>>(
            `${restaurantService}/api/restaurant/toggle-open`,
            {},
            {
                headers: getAuthHeaders()
            }
        );

        if (!data.restaurant) {
            return rejectWithValue("Updated restaurant was not returned.");
        }

        return data.restaurant;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to change restaurant status.")
        );
    }
});


// Fetch all verified restaurants
// GET /api/restaurant/all?page=1&limit=10
export const fetchAllRestaurants = createAsyncThunk<
    { restaurants: IRestaurant[]; pagination: Pagination },
    FetchRestaurantsParams | void,
    { rejectValue: string }
>("restaurant/fetchAllRestaurants", async (params, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<ApiResponse<IRestaurant>>(`${restaurantService}/api/restaurant/all`, {
            params: {
                page: params?.page ?? 1,
                limit: params?.limit ?? 10,
            },
        });

        return {
            restaurants: data.restaurants ?? [],
            pagination: data.pagination ?? {
                ...initialPagination,
                page: params?.page ?? 1,
                limit: params?.limit ?? 10,
            },
        };
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to fetch restaurants.")
        );
    }
});


// Fetch restaurant by ID
// GET /api/restaurant/:id
export const fetchRestaurantById = createAsyncThunk<
    IRestaurant,
    string,
    { rejectValue: string }
>("restaurant/fetchRestaurantById", async (id, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<ApiResponse<IRestaurant>>(
            `${restaurantService}/api/restaurant/${encodeURIComponent(id)}`
        );

        if (!data.restaurant) {
            return rejectWithValue("Restaurant was not found.");
        }

        return data.restaurant;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to fetch restaurant details.")
        );
    }
});

// Search restaurants by name
// GET /api/restaurant/search?name=pizza&page=1&limit=10
export const searchRestaurants = createAsyncThunk<
    { restaurants: IRestaurant[]; pagination: Pagination },
    SearchRestaurantsParams,
    { rejectValue: string }
>("restaurant/searchRestaurants", async ({ name, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<ApiResponse<IRestaurant>>(`${restaurantService}/api/restaurant/search`, {
            params: { name: name.trim(), page, limit },
        });

        return {
            restaurants: data.restaurants ?? [],
            pagination: data.pagination ?? {
                ...initialPagination,
                page,
                limit,
            },
        };
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to search restaurants.")
        );
    }
});





// --------------------------------------------------
// Restaurant Slice
// --------------------------------------------------

const restaurantSlice = createSlice({
    name: "restaurant",

    initialState,

    reducers: {
        setRestaurant(state, action: PayloadAction<IRestaurant | null>) {
            state.restaurant = action.payload;
            state.error = null;
        },

        setRestaurants(state, action: PayloadAction<IRestaurant[]>) {
            state.restaurants = action.payload;
        },

        clearRestaurant: (state) => {
            state.restaurant = null;
            state.error = null;
        },

        clearRestaurantError: (state) => {
            state.error = null;
        },

        clearRestaurantSearch: (state) => {
            state.searchResults = [];
        },

        clearRestaurantState: () => initialState,
    },

    extraReducers: (builder) => {
        builder

            // Fetch seller's restaurant
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
                state.error =
                    action.payload ?? "Failed to fetch your restaurant.";
            })

            // Add restaurant
            .addCase(addRestaurant.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(addRestaurant.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.restaurants.push(action.payload);
                state.error = null;
            })
            .addCase(addRestaurant.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload ?? "Failed to add restaurant.";
            })

            // Edit restaurant
            .addCase(editRestaurant.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(editRestaurant.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.restaurant = action.payload;
                state.error = null;
            })
            .addCase(editRestaurant.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload ?? "Failed to update restaurant.";
            })

            // Toggle restaurant status
            .addCase(toggleRestaurantStatus.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(toggleRestaurantStatus.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.restaurant = action.payload;
                state.error = null;
            })
            .addCase(toggleRestaurantStatus.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload ?? "Failed to change restaurant status.";
            })

            // Fetch all restaurants
            .addCase(fetchAllRestaurants.pending, (state) => {
                state.listLoading = true;
                state.error = null;
            })
            .addCase(fetchAllRestaurants.fulfilled, (state, action) => {
                state.listLoading = false;
                state.restaurants = action.payload.restaurants;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(fetchAllRestaurants.rejected, (state, action) => {
                state.listLoading = false;
                state.error = action.payload ?? "Failed to fetch restaurants.";
            })

            // Fetch restaurant by ID
            .addCase(fetchRestaurantById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedRestaurant = null;
            })
            .addCase(fetchRestaurantById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRestaurant = action.payload;
                state.error = null;
            })
            .addCase(fetchRestaurantById.rejected, (state, action) => {
                state.loading = false;
                state.selectedRestaurant = null;
                state.error =
                    action.payload ?? "Failed to fetch restaurant details.";
            })

            // Search restaurants by name
            .addCase(searchRestaurants.pending, (state) => {
                state.listLoading = true;
                state.error = null;
            })
            .addCase(searchRestaurants.fulfilled, (state, action) => {
                state.listLoading = false;
                state.searchResults = action.payload.restaurants;
                state.pagination = action.payload.pagination;
                state.error = null;
            })
            .addCase(searchRestaurants.rejected, (state, action) => {
                state.listLoading = false;
                state.searchResults = [];
                state.error = action.payload ?? "Failed to search restaurants.";
            })

    }

});

export const {
    setRestaurant,
    setRestaurants,
    clearRestaurant,
    clearRestaurantError,
    clearRestaurantSearch,
    clearRestaurantState,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
