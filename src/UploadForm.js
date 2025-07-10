import React, { useState, useEffect } from "react";
import { getExams, getSubjects, getYears, uploadPDF } from "./api";
import "./UploadForm.css"; // Make sure to create this CSS file or use inline styles

export default function UploadForm() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    examId: "",
    subjectId: "",
    year: "",
    email: "",
    file: null,
  });

  useEffect(() => {
    getExams().then((res) => setExams(res.data));
  }, []);

  useEffect(() => {
    if (form.examId) {
      getSubjects(form.examId).then((res) => setSubjects(res.data));
    }
  }, [form.examId]);

  useEffect(() => {
    if (form.examId && form.subjectId) {
      getYears(form.examId, form.subjectId).then((res) => setYears(res.data));
    }
  }, [form.subjectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((f) => ({ ...f, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file || !form.email || !form.examId || !form.subjectId || !form.year) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", form.file);
    formData.append("email", form.email);
    formData.append("exam_id", form.examId);
    formData.append("subject_id", form.subjectId);
    formData.append("year", form.year);

    try {
      setLoading(true);
      const res = await uploadPDF(formData);
      setResult(res.data);
    } catch (err) {
      alert("Failed to upload and process PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Answer Sheet</h2>

      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <select name="examId" onChange={handleChange} required>
          <option value="">Select Exam</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        <select name="subjectId" onChange={handleChange} required>
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select name="year" onChange={handleChange} required>
          <option value="">Select Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {loading && <div className="loading">Please wait, processing PDF...</div>}

      {result && (
        <div className="result-box">
          <h3>Result</h3>
          <p>Total Questions: {result.totalQuestions}</p>
          <p>Correct Answers: {result.correctAnswers}</p>
        </div>
      )}

      <footer className="footer">
        <p><b>
          Can't find your exam? Contact the admin at{" "}</b>
          <a href="mailto:zerotogodlike@gmail.com">zerotogodlike@gmail.com</a> or message/call{" "}
          <a href="tel:+919359655893">+91-9359655893</a>
        </p>
      </footer>
    </div>
  );
}
