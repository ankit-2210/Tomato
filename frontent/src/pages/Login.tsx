import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../main';
import toast from 'react-hot-toast';
import { useGoogleLogin, type CodeResponse } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAppData } from '../context/useAppData';

const Login = () => {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser, setIsAuth } = useAppData();

    const handleGoogleSuccess = async (authResult: CodeResponse) => {
        if (!authResult.code) {
            toast.error("Google authentication failed.");
            return;
        }

        console.log(authResult);

        setLoading(true);
        try {
            const { data } = await axios.post(`${authService}/api/auth/login`, {
                code: authResult.code,
            });

            localStorage.setItem("token", data.token);

            setUser(data.user);
            setIsAuth(true);

            toast.success(data.message || "Login Successful!");

            navigate("/");
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data);

                toast.error(error.response?.data?.message || "Login failed.");
            }
            else {
                console.error(error);
                toast.error("Something went wrong.");
            }
        }
        finally {
            setLoading(false);
        }
    }

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: handleGoogleSuccess,
        onError: () => {
            toast.error("Google Login Failed");
        },
    });

    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

                {/* Left Section */}
                <div className="hidden md:flex flex-col justify-center bg-linear-to-br from-orange-500 to-red-500 text-white p-12">
                    <h1 className="text-5xl font-bold mb-4">
                        Tomato 🍅
                    </h1>

                    <p className="text-xl opacity-90 leading-relaxed">
                        Discover the best food from your favorite restaurants
                        and get it delivered fast to your doorstep.
                    </p>

                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                        alt="food"
                        className="mt-10 rounded-2xl object-cover h-64 shadow-xl"
                    />
                </div>

                {/* Right Section */}
                <div className="flex items-center justify-center p-8 md:p-12">
                    <div className="w-full max-w-md">

                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-gray-800">
                                Welcome Back
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Login to continue your food journey
                            </p>
                        </div>

                        <button
                            onClick={() => googleLogin()}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-4 text-gray-700 font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                        >
                            <FcGoogle size={24} />
                            {loading
                                ? "Signing in..."
                                : "Continue with Google"}
                        </button>

                        <div className="relative my-8">
                            <div className="border-t"></div>
                            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-sm text-gray-400">
                                Secure Login
                            </span>
                        </div>

                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                            <p className="text-sm text-gray-600 text-center">
                                By continuing, you agree to our{" "}
                                <span className="text-orange-500 font-medium cursor-pointer">
                                    Terms of Service
                                </span>{" "}
                                and{" "}
                                <span className="text-orange-500 font-medium cursor-pointer">
                                    Privacy Policy
                                </span>
                            </p>
                        </div>

                        <p className="text-center text-gray-400 text-sm mt-8">
                            Trusted by thousands of food lovers 🍕
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );

}

export default Login