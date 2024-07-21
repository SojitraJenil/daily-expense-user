import { userProfile } from "atom/atom";
import { useAtom } from "jotai";
import React, { useState } from "react";
import bcrypt from "bcryptjs";
import axios from "axios";

const Profile: React.FC = () => {
  const [ProfileDetails] = useAtom(userProfile);
  const [inputPassword, setInputPassword] = useState<string>("");
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [isResetEmailSent, setIsResetEmailSent] = useState<boolean | null>(
    null
  );
  const [newPassword, setNewPassword] = useState<string>("");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(event.target.value);
  };

  // Handle the case where ProfileDetails might be an array
  const user = Array.isArray(ProfileDetails)
    ? ProfileDetails[0]
    : ProfileDetails;
  const Pass = user?.password;

  const verifyPassword = () => {
    if (!Pass) {
      console.error("Password not available.");
      return;
    }
    bcrypt.compare(inputPassword, Pass, (err, result) => {
      if (err) {
        console.error(err);
        setIsPasswordMatch(false);
      } else {
        setIsPasswordMatch(result);
      }
    });
  };
  const handleResetEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResetEmail(event.target.value);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value);
  };

  const requestPasswordReset = async () => {
    try {
      await axios.post(
        "https://daily-expense-api.onrender.com/password-reset-request",
        {
          email: resetEmail,
        }
      );
      setIsResetEmailSent(true);
    } catch (error) {
      console.error(error);
      setIsResetEmailSent(false);
    }
  };

  const resetPassword = async () => {
    try {
      var response = await axios.post(
        "https://daily-expense-api.onrender.com/reset",
        {
          token: resetToken,
          newPassword,
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Password reset failed");
    }
  };

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
        <div className="mb-4 flex">
          <div className="text-gray-600 font-semibold">Name:</div>
          <div className="text-gray-800 ml-2">{ProfileDetails.name}</div>
        </div>
        <div className="mb-4 flex">
          <div className="text-gray-600 font-semibold">Mobile Number:</div>
          <div className="text-gray-800 ml-2">
            {ProfileDetails.mobileNumber}
          </div>
        </div>
        <div className="mb-4 flex">
          <div className="text-gray-600 font-semibold">email:</div>
          <div className="text-gray-800 ml-2">{ProfileDetails.email}</div>
        </div>
        <div className="mb-4 flex">
          <div className="text-gray-600 font-semibold">Password:</div>
          <input
            type="password"
            value={inputPassword}
            onChange={handlePasswordChange}
            className="ml-2 border rounded p-1"
          />
          <button
            onClick={verifyPassword}
            className="ml-2 bg-blue-500 text-white rounded p-1"
          >
            Verify
          </button>
        </div>
        {isPasswordMatch !== null && (
          <div className="mb-4 flex">
            <div className="text-gray-600 font-semibold">Password Match:</div>
            <div
              className={`text-gray-800 ml-2 ${
                isPasswordMatch ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPasswordMatch ? "Match" : "No Match"}
            </div>
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-800">Forgot Password</h2>
          <div className="mt-4 flex flex-col">
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={handleResetEmailChange}
              className="border rounded p-1 mb-2"
            />
            <button
              onClick={requestPasswordReset}
              className="bg-blue-500 text-white rounded p-1"
            >
              Request Password Reset
            </button>
            {isResetEmailSent !== null && (
              <div
                className={`mt-2 ${
                  isResetEmailSent ? "text-green-500" : "text-red-500"
                }`}
              >
                {isResetEmailSent
                  ? "Reset link sent!"
                  : "Failed to send reset link"}
              </div>
            )}
          </div>
          {resetToken && (
            <div className="mt-6 flex flex-col">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="border rounded p-1 mb-2"
              />
              <button
                onClick={resetPassword}
                className="bg-blue-500 text-white rounded p-1"
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
