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
