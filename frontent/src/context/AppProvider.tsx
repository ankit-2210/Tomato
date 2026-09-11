import axios from "axios";
import { useEffect, useState, type ReactNode } from "react";
import { authService } from "../main";
import type { AppContextType, LocationData, User } from "../types";
import { AppContext } from "./AppContext";

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const [location, setLocation] = useState<LocationData | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [city, setCity] = useState("Fetching Location...");

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            const { data } = await axios.get(`${authService}/api/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(data);
            setIsAuth(true);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Please allow location access.");
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await res.json();
                    // console.log(data);
                    setLocation({
                        latitude,
                        longitude,
                        formattedAddress:
                            data.display_name || "Current Location",
                    });

                    setCity(
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.suburb ||
                        "Your Location"
                    );
                }
                catch (error) {
                    console.error(error);
                    setLocation({
                        latitude,
                        longitude,
                        formattedAddress: "Current Location",
                    });
                    setCity("Failed to load");
                }
                finally {
                    setLoadingLocation(false);
                }
            },
            (error) => {
                console.error(error);
                setCity("Location permission denied");
                setLoadingLocation(false);
            }
        );
    }, []);

    const value: AppContextType = {
        isAuth,
        loading,
        setIsAuth,
        setLoading,
        user,
        setUser,
        location,
        loadingLocation,
        city,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
