import API from "./api.js";

export const getTeacherProfile = async () => {
  try {
    const res = await API.get("/teacher/teacher-profile");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const createOrUpdateTeacherProfile = async (payload) => {
  try {
    const res = await API.post("/teacher/teacher-profile", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const getNewPassword = async (payload) => {
  const res = await API.post("/teacher/password-change", payload);
  return res.data;
};

export const getDashboardProfile = async() =>{
  const res = await API.get("/teacher/teacher-dashboard");
  return res.data;
}


export const getTeacherNotices = async () =>{
  const res = await API.get("/teacher/get-notice");
  return res.data;
}


export const getTeacherPendingLeaves = async () => {
  const res = await API.get("teacher/studentleave/pending");
  return res.data;
};

export const teacherActionOnLeave = async (leaveId, payload) => {
  const res = await API.patch(
    `teacher/studentleave/action/${leaveId}`,
    payload
  );
  return res.data;
};


export const getMyTimeTableTeacher = async ()=>{
  const res = await API.get("/teacher/teacher-time-table");
  return res.data;
}