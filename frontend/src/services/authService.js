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

export const getAdminProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await API.get("/admin/admin-profile",{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });
    return res.data;
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to fetch admin profile",
    };
  }

};

export const createStudentProfile = async(payload) =>{
   const response  = await API.post("/student/student-profile",payload,payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
   return response.data;
}

export const getStudentProfile = async() =>{
   try{
    const token = localStorage.getItem("accessToken");
    const res = await API.get("/student/student-profile",{
      headers:{
        Authorization:`Bearer ${token}`,
      }
    });
    return res.data;
  } catch(error){
    return {
      success:false,
      message:error?.response?.data?.message,
    }  
  }
}

export const getShortProfileStudent = async () => {
  try {
    const res = await API.get("/student/dashboard");
    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};





export const createApplyForm = async (payload) => {
  const res = await API.post("student/apply-form", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getMyApplyForms = async () => {
  const res = await API.get("student/apply-form");
  return res.data;
};

export const createMyGrievance = async(payload) =>{
  const res = await API.post("/student/apply-grievance",payload,{
    headers:{
      "Content-Type":"multipart/form-data",
    },
  });
  return res.data;
}

export const getMyGrievance = async () =>{
  const res = await API.get("/student/apply-grievance");
  return res.data;
}



export const getStudentNotices = async () =>{
  const res = await API.get("/student/get-notice");
  return res.data;
}


export const studentGetAllBooks = async () => {
  const res = await API.get(`${API}/student/all`);
  return res;
};

export const studentGetMyIssued = async () => {
  const res = await API.get("/student/my-issued");
  return res;
};

export const studentRequestReturn = async (data) => {
  const res = await API.post("/student/request-return");
  return res;
};


export const studentGetMyInvoices = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/student/invoice", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; 
};

export const studentGetMyReceipts = async(studentId) =>{
  const res = await API.get(`/student/receipts/${studentId}`);
  res.data;
}



export const studentApplyLeave = async (formDataOrJson) => {
  const res = await API.post("/student/leave-appiled/myself", formDataOrJson);
  return res.data;
};


export const getMyStudentLeaves = async (status = "") => {
  const res = await API.get(
    `/student/leave-appiled/myself/${status ? `?status=${status}` : ""}`
  );
  return res.data;
};

export const getMyClassTimeTableStudent = async ()=>{
  const res = await API.get("/student/timetable-student");
  return res.data;
}