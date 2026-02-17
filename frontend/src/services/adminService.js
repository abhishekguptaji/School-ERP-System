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

export const getAllStudentsByAdmin = async ({
  search = "",
  status = "all",
  className = "all",
  page = 1,
  limit = 10,
} = {}) => {
  const { data } = await API.get("/admin/students", {
    params: { search, status, className, page, limit },
  });

  return data;
};

export const getIdStudentByAdmin = async (id) => {
  if (!id) throw new Error("Student ID is required");

  const { data } = await API.get(`/admin/students/${id}`);
  return data;
};


//**=============================================================== */


export const adminAddBook = async (data) => {
  const res = await API.post("/admin/addBook", data);
  return res.data;
};

export const adminGetAllBooks = async () => {
  const res = await API.get("/admin/seeAllBooks");
  return res.data;
};

export const adminGetBookCopies = async (bookId) => {
  const res = await API.get(`/admin/book/${bookId}/copies`);
  return res.data;
};

export const adminAddMoreCopies = async (bookId, data) => {
  const res = await API.post(`/admin/book/${bookId}/copies`, data);
  return res.data;
};

export const adminIssueCopy = async (copyId, data) => {
  const res = await API.put(`/admin/copy/${copyId}/issue`, data);
  return res.data;
};

export const adminDeleteBook = async (bookId) => {
  const res = await API.delete(`/admin/book/${bookId}`);
  return res.data;
};

export const adminGetReturnRequests = async () => {
  const res = await API.get("/admin/return-requests");
  return res.data;
};

export const adminAcceptReturn = async (requestId) => {
  const res = await API.put(`/admin/return-requests/${requestId}/accept`);
  return res.data;
};

export const adminRejectReturn = async (requestId) => {
  const res = await API.put(`/admin/return-requests/${requestId}/reject`);
  return res.data;
};

// ****************************************************************************//

export const allocateSubjectTeacher = async (payload) => {
  const res = await API.post(`/admin/allocate-subject-teacher`, payload);
  return res.data;
};

export const deleteClassSubjectAllocation = async (classId, subjectId) => {
  const res = await API.delete(`/admin/deletedClassSubject/${classId}/${subjectId}`);
  return res.data;
};


export const getAllocatedClass = async (classId) => {
  const res = await API.get(`/admin/allocatedclass/${classId}`);
  return res.data;
};


export const getAllClassesSubjectTimeTable = async()=>{
  const res = await API.get("/admin/all-class-time-table");
  return res.data;
}

export const getAllTeacherforTimeTable = async()=>{
  const res = await API.get("/admin/all-teacher-time-table");
  return res.data;
}

export const getSubjectsByClass = async(classId)=>{
  const res =await API.get(`/admin/subject-by-class/${classId}`);
  return res.data;
}
/********************************************************************************** */


//      Time table api hai  

export const getTimeTable = async(classId)=>{
  const res = await API.get(`/admin/timetable/${classId}`);
  return res.data;
}

export const saveTimeTableCell = async(payload) =>{
  const res =await API.post(`/admin/timetable/save`, payload);
  return res.data;
}
  
export const deleteTimeTableCell = async(classId, day, periodNo) =>{
  const res = await API.delete(`/admin/timetable/${classId}/${day}/${periodNo}`);
  return res.data;
}
  
export const clearTimeTable = async(classId) =>{
  const res = await API.delete(`/admin/timetable/clear/${classId}`);
  return res.data;
}
  