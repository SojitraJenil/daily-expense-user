import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Button, CircularProgress } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import useHome from "context/HomeContext";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

function Profile() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const cookies = new Cookies();
  const CookieGet = cookies.get("ProfileImage");
  const router = useRouter();
  const { userProfile } = useHome();

  useEffect(() => {
    if (userProfile && userProfile.profileImageUrl) {
      setProfileImageUrl(userProfile.profileImageUrl);
    }
  }, [userProfile]);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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

  const handleImageUpload = () => {
    if (!imageUpload) return;

    const imageRef = ref(storage, `profileImages/${userProfile._id}`);
    const uploadTask = uploadBytesResumable(imageRef, imageUpload);

    setIsUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress (optional: show a progress bar)
      },
      (error) => {
        if (error.code === "storage/permission-denied") {
          console.error("Permission denied:", error.message);
        } else {
          console.error("Upload failed:", error.message);
        }
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfileImageUrl(downloadURL); // Update profile image URL
          cookies.set("ProfileImage", downloadURL); // Set cookie with the new image URL
          setIsUploading(false);
          setImageUpload(null); // Clear the image upload state
          setEditMode(false); // Exit edit mode after successful upload
        });
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageUpload(e.target.files[0]);
    }
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
            src={profileImageUrl || CookieGet}
            alt="Profile"
          />
        </div>
        <div className="text-center px-6 py-4">
          <h2 className="text-gray-800 text-3xl font-bold">
            {userProfile?.name}
          </h2>
          <p className="text-gray-600">{userProfile?.mobileNumber}</p>
          {editMode ? (
            <div className="flex justify-center items-center mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleImageUpload}
                disabled={isUploading || !imageUpload}
                className="ml-4"
              >
                {isUploading ? <CircularProgress size={24} /> : "Upload Image"}
              </Button>
            </div>
          ) : (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setEditMode(true)}
              className="mt-4"
            >
              Edit Profile
            </Button>
          )}

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
            {userProfile?.email || "user@gmail.com"}
          </p>
          <hr className="mb-1" />
          <h3 className="text-gray-800 text-xl font-semibold mt-4">Password</h3>
          <div className="flex justify-between">
            <p className="text-gray-600 mt-2">
              {isPasswordVisible ? userProfile?.password : "********"}
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
            {userProfile?._id || "No interests listed"}
          </p>
          <hr className="mb-1" />
        </div>
        {/* Action Buttons */}
        <div className="px-6 py-4 flex justify-between">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setEditMode(true)}
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
