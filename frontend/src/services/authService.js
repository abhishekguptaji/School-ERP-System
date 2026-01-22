import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, 
  // VERY IMPORTANT for cookies
});

export const loginUser = async (payload) => {
  const response = await API.post("/user/login", payload);
  return response.data;
};

export const logoutUser = async (payload) => {
  try {
    const res = await API.post("/user/logout", payload);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Logout failed",
    };
  }
};
