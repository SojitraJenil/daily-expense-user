import React, { useEffect, useState } from "react";
import { showProfile } from "API/api";
import Cookies from "universal-cookie";
import Image from "next/image"; // Import Image from Next.js if you're using Next.js

const Profile: React.FC = () => {
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false); // State for password visibility
  const cookies = new Cookies();
  const userId = cookies.get("UserId");

  const fetchProfile = async () => {
    try {
      const response = await showProfile(userId);
      setProfileDetails(response.user);
    } catch (error) {
      console.error("Failed to fetch profile details:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profileDetails) {
    return <div>Loading...</div>;
  }

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="h-[100%] bg-white p-6 w-full max-w-md mx-auto mt-8">
      <div className="flex flex-col shadow-lg rounded-lg items-center mb-6">
        <div className="relative w-32 h-32 mb-4">
          <Image
            src={require("../../public/download.jpeg")} // Adjust path as necessary
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="rounded-full border-4 border-gray-200"
          />
        </div>
        <p className="text-2xl font-semibold text-gray-800">
          {profileDetails.name}
        </p>
      </div>
      <div className="mb-4 flex">
        <div className="text-gray-600 font-semibold w-32">Name:</div>
        <div className="text-gray-800">{profileDetails.name}</div>
      </div>
      <div className="mb-4 flex">
        <div className="text-gray-600 font-semibold w-32">Mobile Number:</div>
        <div className="text-gray-800">{profileDetails.mobileNumber}</div>
      </div>
      <div className="mb-4 flex">
        <div className="text-gray-600 font-semibold w-32">Email:</div>
        <div className="text-gray-800">
          {profileDetails.email || "user@gmail.com"}
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <div className="text-gray-600 font-semibold w-32">Password:</div>
        <div className="text-gray-800 flex items-center">
          <span>
            {isPasswordVisible ? profileDetails.password : "********"}
          </span>
          <button
            onClick={handleTogglePasswordVisibility}
            className="ml-2 text-blue-500 hover:underline"
          >
            {isPasswordVisible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
