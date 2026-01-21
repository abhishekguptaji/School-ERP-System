import API from "./api";

const registerUser = async (formData) => {
  const response = await API.post("/user/register", formData);
  return response.data;
};

const loginUser = async (formData) => {
  const response = await API.post("/user/login", formData);
  return response.data;
};

export {
  registerUser,
  loginUser,
}