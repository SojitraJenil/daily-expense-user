/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "../../firebase";
import Cookies from "universal-cookie";
import dynamic from "next/dynamic";

function Auth1() {
    const cookies = new Cookies();
    const router = useRouter();

    useEffect(() => {
        const authToken = cookies.get("auth-token");
        if (authToken) {
            console.log("Navigating to /join");
            router.push("/join");
        }
    }, [cookies, router]);

    const signInGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const cookies = new Cookies();
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 15); // Add 7 days to the current date
            cookies.set("auth-token", result.user.refreshToken, {
                expires: expiryDate,
            });
            router.push("/join");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-center h-screen relative z-30">
                <div className="max-w-md w-full px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg opacity-70">
                    <h2 className="text-2xl font-semibold text-center text-gray-800">
                        Authentication
                    </h2>
                    <hr className="text-gray-100 my-2" />
                    <button
                        onClick={signInGoogle}
                        className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-70 duration-300 text-[#002D74]"
                    >
                        <FcGoogle className="text-2xl me-4" />
                        Login with Google
                    </button>
                    <button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-70 duration-300 text-[#002D74]">
                        <FaFacebook className="text-2xl me-4" />
                        Login with Facebook
                    </button>
                </div>
            </div>
        </div>
    );
}
export default dynamic(() => Promise.resolve(Auth1), { ssr: false });
