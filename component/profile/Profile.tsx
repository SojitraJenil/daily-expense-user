import React from "react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 mb-4">
            {/* <Image
              src="https://via.placeholder.com/100"
              alt="Profile Picture"
              layout="fill"
              objectFit="cover"
              className="rounded-full border-4 border-gray-200"
            /> */}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        </div>
        <div className="mb-4">
          <div className="text-gray-600 font-semibold">Email:</div>
          <div className="text-gray-800">{"email"}</div>
        </div>
        <div className="mb-4">
          <div className="text-gray-600 font-semibold">Phone:</div>
          <div className="text-gray-800">{"phone"}</div>
        </div>
        <div className="mb-6">
          <div className="text-gray-600 font-semibold">Location:</div>
          <div className="text-gray-800">{"location"}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
