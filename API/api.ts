import { cookies } from "next/headers";
import { axiosInstance } from "./axios";
import Cookies from "universal-cookie";

export const registerData = async (
  name: string,
  email: string,
  mobileNumber: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post(`/register`, {
      name,
      email,
      mobileNumber,
      password,
    });
    return response;
  } catch (error: any) {
    if (error.response) {
      const ErrorMessage = error.response.data.message;
      return ErrorMessage;
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};
export const loginData = async (mobileNumber: string, password: string) => {
  try {
    const response = await axiosInstance.post(`/login`, {
      mobileNumber,
      password,
    });
    return response;
  } catch (error: any) {
    if (error.response) {
      const ErrorMessage = error.response.data.message;
      return ErrorMessage;
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const getUser = async () => {
  try {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const response = await axiosInstance.get("/data", {
      headers: {
        Authorization: token, // Ensure token is sent in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
export const deleteUser = async (id: string) => {
  try {
    await axiosInstance.delete(`/user/${id}`);
  } catch (error: any) {
    if (error.response) {
      const ErrorMessage = error.response.data.message;
      return ErrorMessage;
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

// =============================Add the expense===========================
export const addExpense = async (formValues: any) => {
  try {
    const response = await axiosInstance.post(`/createExpense`, formValues);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const ErrorMessage = error.response.data.message;
      return ErrorMessage;
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

// Get all expenses
export const showAllExpenses = async () => {
  try {
    const response = await axiosInstance.get(`/showAllExpenses`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (id: string) => {
  try {
    await axiosInstance.delete(`/deleteExpense/${id}`);
  } catch (error: any) {
    if (error.response) {
      const ErrorMessage = error.response.data.message;
      return ErrorMessage;
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

// Update an expense
export const updateExpense = async (id: string, formValues: any) => {
  try {
    const response = await axiosInstance.put(
      `/updateExpense/${id}`,
      formValues
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const ErrorMessage = error.response.data.message;
      return ErrorMessage;
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

// ========================Fuel Details ===========================
export const addFuelDetails = async (formValues: any) => {
  try {
    const response = await axiosInstance.post(`/addFuelDetails`, formValues);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const ErrorMessage = error.response.data.message;
      return ErrorMessage;
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

export const showAllFuelDetails = async () => {
  try {
    const response = await axiosInstance.get(`/showFuelDetails`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};
export const showProfile = async (id: any) => {
  try {
    const response = await axiosInstance.get(`/user/profile/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};
// Delete an expense
export const deleteFuelDetails = async (id: string) => {
  try {
    await axiosInstance.delete(`/DeleteFuelDetail/${id}`);
  } catch (error: any) {
    if (error.response) {
      const ErrorMessage = error.response.data.message;
      return ErrorMessage;
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

// Update an expense
export const updateFuelDetails = async (id: string, formValues: any) => {
  try {
    const response = await axiosInstance.put(
      `/UpdateFuelDetail/${id}`,
      formValues
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const ErrorMessage = error.response.data.message;
      return ErrorMessage;
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};
