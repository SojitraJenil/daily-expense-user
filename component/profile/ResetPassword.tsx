import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const { token } = router.query; // Extract token from the URL
  const [newPassword, setNewPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://daily-expense-api.onrender.com/reset-password",
        {
          token,
          newPassword,
        }
      );

      setMessage("Password has been successfully reset.");
      // Optionally, redirect to login page after successful reset
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold mb-1">
              New Password:
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded p-2">
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
