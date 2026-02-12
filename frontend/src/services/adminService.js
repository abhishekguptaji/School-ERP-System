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

export const getAllGrievancesByAdmin = async (params) => {
  const res = await API.get("/admin/get-all-grivence", { params });
  return res.data; 
};

// =====================
export const getAllTeachersForAssign = async () => {
  const res = await API.get("/admin/teachers");
  return res.data;
};


export const replyToGrievanceByAdmin = async (grievanceId, payload) => {
  const res = await API.post(
    `/admin/grievances/${grievanceId}/reply`,
    payload
  );
  return res.data;
};


export const updateGrievanceStatus = async (grievanceId, payload) => {
  const res = await API.patch(
    `/admin/grievances/${grievanceId}/status`,
    payload
  );
  return res.data;
};


export const assignTeacherToGrievance = async (grievanceId, payload) => {
  const res = await API.patch(
    `/admin/grievances/${grievanceId}/assign`,
    payload
  );
  return res.data;
};

export const getAllStudentProfilesByAdmin = async()=>{
   const res = await API.get("/admin/students");
  return  res.data.data;
}

export const getCompleteStudentProfileByAdmin = async (profileId) => {
  const res = await API.get(`/admin/students/${profileId}/complete`);
  return res.data;
};

