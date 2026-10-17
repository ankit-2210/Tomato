import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import type { IMenuItem } from "../../../types";
import { restaurantService } from "../../../main";

// API RESPONSE TYPES
interface MenuItemsResponse {
    success: boolean;
    count?: number;
    message?: string;
    menuItems: IMenuItem[];
}

interface MenuItemResponse {
    success: boolean;
    message?: string;
    menuItem: IMenuItem;
}

interface DeleteMenuItemResponse {
    success: boolean;
    message: string;
}

interface ToggleAvailabilityResponse {
    success: boolean;
    message: string;
    isAvailable: boolean;
}

interface ApiErrorResponse {
    message?: string;
}

interface MenuItemState {
    items: IMenuItem[];
    selectedItem: IMenuItem | null;
    searchResults: IMenuItem[];
    loading: boolean;
    actionLoading: boolean;
    error: string | null;
    message: string | null;
}

interface UpdateMenuItemPayload {
    id: string;
    formData: FormData;
}


// INITIAL STATE
const initialState: MenuItemState = {
    items: [],
    selectedItem: null,
    searchResults: [],
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
};


// COMMON ERROR HANDLER
const getErrorMessage = (
    error: unknown,
    fallback: string
): string => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return (
            error.response?.data?.message ??
            error.message ??
            fallback
        );
    }

    return fallback;
};

// FETCH ALL MENU ITEMS
// GET /api/menu-item/all/:id
export const fetchMenuItems = createAsyncThunk<IMenuItem[], string,
    { rejectValue: string }
>("menuItem/fetchAll", async (restaurantId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Authentication required");
        }

        const { data } = await axios.get<MenuItemsResponse>(
            `${restaurantService}/api/menu-item/all/${restaurantId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return data.menuItems;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to fetch menu items.")
        );
    }
});


// FETCH SINGLE MENU ITEM
// GET /api/menu/single/:id
export const fetchSingleMenuItem = createAsyncThunk<IMenuItem, string,
    { rejectValue: string }
>("menuItem/fetchSingle", async (itemId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Authentication required");
        }

        const { data } = await axios.get<MenuItemResponse>(
            `${restaurantService}/api/menu-item/single/${itemId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return data.menuItem;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to fetch menu item.")
        );
    }
});


// ADD MENU ITEM
// POST /api/menu/add
// Payload: FormData
export const addMenuItem = createAsyncThunk<IMenuItem, FormData,
    { rejectValue: string }
>("menuItem/add", async (formData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Authentication required");
        }

        const { data } = await axios.post<MenuItemResponse>(
            `${restaurantService}/api/menu-item/add`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return data.menuItem;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to add menu item.")
        );
    }
});

// UPDATE MENU ITEM
// PUT /api/menu/update/:id
// Payload: { id, formData }
export const updateMenuItem = createAsyncThunk<IMenuItem, UpdateMenuItemPayload,
    { rejectValue: string }
>("menuItem/update", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Authentication required");
        }

        const { data } = await axios.put<MenuItemResponse>(
            `${restaurantService}/api/menu-item/update/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return data.menuItem;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to update menu item.")
        );
    }
});


// DELETE MENU ITEM
// DELETE /api/menu-item/delete/:id
export const deleteMenuItem = createAsyncThunk<{ id: string; message: string },
    string, { rejectValue: string }
>("menuItem/delete", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Authentication required");
        }

        const { data } = await axios.delete<DeleteMenuItemResponse>(
            `${restaurantService}/api/menu-item/delete/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            id,
            message: data.message,
        };
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to delete menu item.")
        );
    }
});


// TOGGLE MENU ITEM AVAILABILITY
// PATCH /api/menu/toggle-availability/:id
export const toggleMenuItemAvailability = createAsyncThunk<{ id: string; isAvailable: boolean; message: string },
    string, { rejectValue: string }
>("menuItem/toggleAvailability", async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Authentication required");
        }

        const { data } = await axios.patch<ToggleAvailabilityResponse>(
            `${restaurantService}/api/menu-item/toggle-availability/${id}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            id,
            isAvailable: data.isAvailable,
            message: data.message,
        };
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to toggle menu item availability.")
        );
    }
});

// SEARCH MENU ITEMS
// GET /api/menu/search/:restaurantId?search=...
export const searchMenuItems = createAsyncThunk<IMenuItem[], { restaurantId: string; search: string },
    { rejectValue: string }
>("menuItem/search", async ({ restaurantId, search }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return rejectWithValue("Authentication required");
        }

        const { data } = await axios.get<MenuItemsResponse>(
            `${restaurantService}/api/menu-item/search/${restaurantId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    search,
                },
            }
        );

        return data.menuItems;
    }
    catch (error: unknown) {
        return rejectWithValue(
            getErrorMessage(error, "Failed to search menu items.")
        );
    }
});


// SLICE
const menuItemSlice = createSlice({
    name: "menuItem",
    initialState,

    reducers: {
        clearMenuItemError(state) {
            state.error = null;
        },
        clearMenuItemMessage(state) {
            state.message = null;
        },
        clearSelectedMenuItem(state) {
            state.selectedItem = null;
        },
        clearSearchResults(state) {
            state.searchResults = [];
        },

        resetMenuItemState(state) {
            state.items = [];
            state.selectedItem = null;
            state.searchResults = [];
            state.loading = false;
            state.actionLoading = false;
            state.error = null;
            state.message = null;
        }
    },

    extraReducers: (builder) => {
        builder

            // FETCH ALL
            .addCase(fetchMenuItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMenuItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMenuItems.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ?? "Failed to fetch menu items.";
            })


            // FETCH SINGLE
            .addCase(fetchSingleMenuItem.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(fetchSingleMenuItem.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.selectedItem = action.payload;
            })
            .addCase(fetchSingleMenuItem.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload ?? "Failed to fetch single menu item.";
            })

            // ADD
            .addCase(addMenuItem.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(addMenuItem.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.items.unshift(action.payload);
                state.message = "Menu item added successfully.";
            })
            .addCase(addMenuItem.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload ?? "Failed to add menu item.";
            })

            // UPDATE
            .addCase(updateMenuItem.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateMenuItem.fulfilled, (state, action) => {
                state.actionLoading = false;

                const updatedItem = action.payload;

                state.items = state.items.map((item) =>
                    item._id === updatedItem._id ? updatedItem : item);
                if (state.selectedItem && state.selectedItem._id === updatedItem._id) {
                    state.selectedItem = updatedItem;
                }

                state.searchResults = state.searchResults.map((item) =>
                    item._id === updatedItem._id ? updatedItem : item);

                state.message = "Menu item updated successfully.";
            })
            .addCase(updateMenuItem.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload ?? "Failed to update menu item.";
            })

            // DELETE
            .addCase(deleteMenuItem.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteMenuItem.fulfilled, (state, action) => {
                state.actionLoading = false;

                const { id, message } = action.payload;
                state.items = state.items.filter((item) => item._id !== id);
                state.searchResults = state.searchResults.filter((item) => item._id !== id);
                if (state.selectedItem && state.selectedItem._id === id) {
                    state.selectedItem = null;
                }

                state.message = message;
            })
            .addCase(deleteMenuItem.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload ?? "Failed to delete menu item.";
            })

            // TOGGLE AVAILABILITY
            .addCase(toggleMenuItemAvailability.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(toggleMenuItemAvailability.fulfilled, (state, action) => {
                state.actionLoading = false;

                const { id, isAvailable, message } = action.payload;
                state.items = state.items.map((item) =>
                    item._id === id ? { ...item, isAvailable } : item);
                state.searchResults = state.searchResults.map((item) =>
                    item._id === id ? { ...item, isAvailable } : item);
                if (state.selectedItem && state.selectedItem._id === id) {
                    state.selectedItem.isAvailable = isAvailable;
                }

                state.message = message;
            })
            .addCase(toggleMenuItemAvailability.rejected, (state, action) => {
                state.actionLoading = false;
                state.error =
                    action.payload ?? "Failed to update menu item availability.";
            })

            // SEARCH
            .addCase(searchMenuItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMenuItems.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchMenuItems.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ?? "Failed to search menu items.";
            })


    }
});

export const {
    clearMenuItemError,
    clearMenuItemMessage,
    clearSelectedMenuItem,
    clearSearchResults,
    resetMenuItemState
} = menuItemSlice.actions;

export default menuItemSlice.reducer;
