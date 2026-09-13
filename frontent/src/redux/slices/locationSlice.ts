import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { LocationData } from "../../types";


interface LocationState {
    location: LocationData | null;
    loadingLocation: boolean;
    city: string;
}

const initialState: LocationState = {
    location: null,
    loadingLocation: false,
    city: "Fetching Location...",
};

export const fetchLocation = createAsyncThunk("location/fetchLocation", async (_, { rejectWithValue }) => {
    return new Promise<LocationData>((resolve, reject) => {
        if (!navigator.geolocation) {
            reject("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await response.json();

                    resolve({
                        latitude,
                        longitude,
                        formattedAddress:
                            data.display_name || "Current Location",
                    });
                }
                catch {
                    resolve({
                        latitude,
                        longitude,
                        formattedAddress: "Current Location",
                    })
                }
            },
            (error) => {
                reject(error.message);
            }

        )
    });

});


const locationSlice = createSlice({
    name: "location",

    initialState,

    reducers: {
        setCity: (state, action) => {
            state.city = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchLocation.pending, (state) => {
                state.loadingLocation = true;
                state.city = "Fetching Location...";
            })
            .addCase(fetchLocation.fulfilled, (state, action) => {
                state.loadingLocation = false;
                state.location = action.payload;

                state.city = action.payload.formattedAddress || "Your Location";
            })
            .addCase(fetchLocation.rejected, (state) => {
                state.loadingLocation = false;
                state.city = "Location permission denied";
            })
    }
})


export const { setCity } = locationSlice.actions;

export default locationSlice.reducer;

