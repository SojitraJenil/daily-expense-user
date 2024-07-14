import { axiosInstance } from "./axios";

export const registerData = async (
  name: string,
  mobileNumber: string,
  email: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post(`/UserRegister`, {
      name,
      mobileNumber,
      email,
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
    const response = await axiosInstance.post(`/UserLogin`, {
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
    const response = await axiosInstance.get("/UserShow");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
