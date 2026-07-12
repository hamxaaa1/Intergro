import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://intergro.onrender.com//api", // ✅ lowercase
  withCredentials: true,
});
