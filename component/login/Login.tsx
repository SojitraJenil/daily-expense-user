import React from "react";
import { FcGoogle } from "react-icons/fc";

function Login() {
    return (
        <div className="relative bg-gray-200">
            <div className="flex items-center justify-center h-screen relative z-30 ">
                <div className="max-w-md w-full px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg opacity-80">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                        Login{" "}
                    </h2>
                    <form className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Number
                            </label>
                            <input
                                type="number"
                                id="name"
                                max={10}
                                className="mt-1 p-2 text-black block w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your Mobile Number"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="room"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <input
                                type="number"
                                id="room"
                                className="mt-1 text-black p-2 block w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Join Room
                            </button>
                        </div>
                    </form>
                    <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-70 duration-300 text-[#002D74]">
                        <FcGoogle className="text-2xl me-4" />
                        Login with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
