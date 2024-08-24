/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { showProfile } from "API/api";
import Cookies from "universal-cookie";
import { Box, CircularProgress, Button } from "@mui/material";
import { useAtom } from "jotai";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { NavigateNameAtom, userProfileName } from "atom/atom";
import { useRouter } from "next/router";
import Swal from "sweetalert2"; // Import SweetAlert2

function Profile() {
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [, serUserName] = useAtom(userProfileName);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const cookies = new Cookies();
  const [isNavigate] = useAtom(NavigateNameAtom);
  const userId = cookies.get("UserId");
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const response = await showProfile(userId);
      setProfileDetails(response.user);
      serUserName(response.user.name);
    } catch (error) {
      console.error("Failed to fetch profile details:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isNavigate]);

  if (!profileDetails) {
    return (
      <Box className="flex justify-center items-center h-full my-[250px]">
        <CircularProgress />
      </Box>
    );
  }

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        cookies.remove("token");
        cookies.remove("UserId");
        cookies.remove("mobileNumber");
        router.push("/login");
      }
    });
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white pb-20 overflow-hidden">
        {/* Header Section */}
        <div className="h-32 bg-blue-600 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://media.istockphoto.com/id/1407983911/photo/forex-diagrams-and-stock-market-rising-lines-with-numbers.jpg?s=612x612&w=0&k=20&c=zas1h6LR6v2iCvE7SWnVoZ_s7ZSiboN45UK0d5oMWac="
            alt="Cover"
          />
        </div>
        {/* Profile Section */}
        <div className="flex justify-center px-5 -mt-16">
          <img
            className="h-32 w-32 bg-white p-2 rounded-full border border-black"
            src={`https://robohash.org/${profileDetails.name}`}
            alt="Profile"
          />
        </div>
        <div className="text-center px-6 py-4">
          <h2 className="text-gray-800 text-3xl font-bold">
            {profileDetails.name}
          </h2>
          <p className="text-gray-600">{profileDetails.mobileNumber}</p>
          <div className="flex justify-center items-center mt-2">
            <p className="text-gray-800"></p>
          </div>
          <p className="mt-2 text-gray-500 text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
        <hr />
        {/* Additional Profile Information */}
        <div className="px-6 py-4">
          <h3 className="text-gray-800 text-xl font-semibold">Email</h3>
          <p className="text-gray-600 mt-2">
            {profileDetails.email || "user@gmail.com"}
          </p>
          <hr className="mb-1" />
          <h3 className="text-gray-800 text-xl font-semibold mt-4">Password</h3>
          <div className="flex justify-between">
            <p className="text-gray-600 mt-2">
              {isPasswordVisible ? profileDetails.password : "********"}
            </p>
            <button
              onClick={handleTogglePasswordVisibility}
              className="ml-2 text-blue-500 hover:underline"
            >
              {isPasswordVisible ? (
                <VisibilityOffIcon className="text-blue-500 align-middle text-4xl mb-2" />
              ) : (
                <VisibilityIcon className="text-blue-500 align-middle text-4xl mb-2" />
              )}
            </button>
          </div>
          <hr className="mb-1" />
          <h3 className="text-gray-800 text-xl font-semibold mt-4">
            Interests
          </h3>
          <p className="text-gray-600 mt-2">
            {profileDetails.interests || "No interests listed"}
          </p>
          <hr className="mb-1" />
        </div>
        {/* Action Buttons */}
        <div className="px-6 py-4 flex justify-between">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
