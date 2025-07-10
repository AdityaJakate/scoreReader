import axios from "axios";

const API = axios.create({
  baseURL: "http://144.24.107.250:8000",
  // baseURL: "http://localhost:8000", // FastAPI backend URL
 // FastAPI backend URL
});

export const getExams = () => API.get("/exams");
export const getSubjects = (examId) => API.get("/subjects", { params: { exam_id: examId } });
export const getYears = (examId, subjectId) => API.get("/years", { params: { exam_id: examId, subject_id: subjectId } });
export const uploadPDF = (formData) =>
  API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
