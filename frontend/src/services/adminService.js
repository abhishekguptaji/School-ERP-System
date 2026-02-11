import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, 
});


export const createNoticesByAdmin = async(payload) =>{
  const res = await API.post("/admin/create-notice",
    payload,{
      headers:{
        "Content-Type":"multipart/form-data",
      },
    }
  );
  return res.data;
}

export const getAdminNotice = async() =>{
  const res = await API.get("/admin/get-notice");
  return res.data;
}  

export const deleteNotice = async (id) => {
  const res = await API.delete(`/admin/delete-notice/${id}`);
  return res.data;
};
