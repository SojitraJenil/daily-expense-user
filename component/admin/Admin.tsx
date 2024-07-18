import React, { useEffect, useState } from "react";
import { deleteUser, getUser } from "API/api";
import DeleteIcon from "@mui/icons-material/Delete";

const Admin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
    }
  }, [isLoggedIn]);

  const fetchAllData = async () => {
    try {
      const response = await getUser();
      setUsers(response.data);
      console.log("response", response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const staticEmail = "admin@gmail.com";
  const staticPassword = "admin123";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === staticEmail && password === staticPassword) {
      setIsLoggedIn(true);
      setError(null);
    } else {
      setIsLoggedIn(false);
      setError("Invalid credentials. Please try again.");
    }
  };

  const HandleDelete = (id: string) => {
    try {
      const response = deleteUser(id);
      fetchAllData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Admin Login
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                className="mt-1 p-2 text-black block w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your Email"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleChange}
                className="mt-1 text-black p-2 block w-full border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your Password"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-lg font-bold text-center mb-4">User Admin</h1>
      {users.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.mobileNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.password}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  onClick={() => {
                    HandleDelete(user._id);
                  }}
                >
                  <DeleteIcon />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No users found.</p>
      )}
    </div>
  );
};

export default Admin;
