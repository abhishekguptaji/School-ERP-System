import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

export const createNoticesByAdmin = async (payload) => {
  const res = await API.post("/admin/create-notice", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getAdminNotice = async () => {
  const res = await API.get("/admin/get-notice");
  return res.data;
};

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
  const res = await API.post(`/admin/grievances/${grievanceId}/reply`, payload);
  return res.data;
};

export const updateGrievanceStatus = async (grievanceId, payload) => {
  const res = await API.patch(
    `/admin/grievances/${grievanceId}/status`,
    payload,
  );
  return res.data;
};

export const assignTeacherToGrievance = async (grievanceId, payload) => {
  const res = await API.patch(
    `/admin/grievances/${grievanceId}/assign`,
    payload,
  );
  return res.data;
};

export const getAllStudentProfilesByAdmin = async () => {
  const res = await API.get("/admin/students");
  return res.data.data;
};

export const getCompleteStudentProfileByAdmin = async (profileId) => {
  const res = await API.get(`/admin/students/${profileId}/complete`);
  return res.data;
};

// ------------------------------------------------///

export const createSubjectByAdmin = async (data) => {
  const res = await API.post("/admin/subjects", data);
  return res.data;
};

export const getAllSubjectsByAdmin = async () => {
  const res = await API.get("/admin/subjects");
  return res.data;
};

export const deleteSubjectByAdmin = async (id) => {
  const res = await API.delete(`/admin/subjects/${id}`);
  return res.data;
};

export const getAllClassesWithSubjectsByAdmin = async () => {
  const res = await API.get("/admin/classes-subjects");
  return res.data;
};

export const allocateSubjectsToClassByAdmin = async (classId, data) => {
  const res = await API.put(`/admin/classes/${classId}/subjects`, data);
  return res.data;
};

export const getAllTeacherByAdmin = async ({
  search = "",
  status = "all",
  department = "all",
  page = 1,
  limit = 10,
} = {}) => {
  const { data } = await API.get("/admin/teachers", {
    params: { search, status, department, page, limit },
  });

  return data;
};

export const getIdTeacherByAdmin = async (id) => {
  if (!id) throw new Error("Teacher ID is required");

  const { data } = await API.get(`/admin/teachers/${id}`);
  return data;
};
