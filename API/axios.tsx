import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://daily-expense-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});
//   baseURL: "http://localhost:2000/",
// baseURL: "https://daily-expense-api.onrender.com",
