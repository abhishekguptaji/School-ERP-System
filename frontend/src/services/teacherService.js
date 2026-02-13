import API from "./api.js";

export const getNewPassword = async (payload) => {
  const res = await API.post("/teacher/password-change", payload);
  return res.data;
};


export const getTeacherNotices = async () =>{
  
}
