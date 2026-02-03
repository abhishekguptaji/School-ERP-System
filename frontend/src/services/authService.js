import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, 
});

export const registerUser = async (payload) => {
  try {
    const res = await API.post("/user/register", payload);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "User not created",
    };
  }
};


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

export const getAdminProfile = async (payload) => {
  try {
    const res = await API.get("/admin-profile",payload);
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to fetch admin profile",
    };
  }

};