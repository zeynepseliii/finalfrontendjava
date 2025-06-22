import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../ekran.png"; // Logo dosyası src/images/logo.png içinde olmalı

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({
    name: "",
    surname: "",
    email: "",
    midterm: "",
    finalExam: "",
    project: "",
    attendance: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  const handleInputChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async () => {
    try {
      await axios.post("http://localhost:8080/students", studentForm);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error("Öğrenci eklenemedi:", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Öğrenci silinemedi:", error);
    }
  };

  const handleEditStudent = (student) => {
    setIsEditing(true);
    setEditId(student.id);
    setStudentForm({
      name: student.name,
      surname: student.surname,
      email: student.email,
      midterm: student.midterm,
      finalExam: student.finalExam,
      project: student.project,
      attendance: student.attendance,
    });
  };

  const handleUpdateStudent = async () => {
    try {
      await axios.put(`http://localhost:8080/students/${editId}`, studentForm);
      resetForm();
      fetchStudents();
    } catch (error) {
      console.error("Öğrenci güncellenemedi:", error);
    }
  };

  const resetForm = () => {
    setStudentForm({
      name: "",
      surname: "",
      email: "",
      midterm: "",
      finalExam: "",
      project: "",
      attendance: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const getAverageColor = (avg) => {
    if (avg >= 85) return "#22c55e"; // yeşil
    if (avg >= 50) return "#eab308"; // sarı
    return "#ef4444"; // kırmızı
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
      {/* ÜST BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1e293b",
          padding: "16px 32px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
      >
        <img src={logo} alt="Logo" style={{ height: "50px", position: "absolute", left: "32px" }} />
        <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "bold" }}>
          Bilgisayar Bilimleri Dersi
        </h1>
      </div>

      {/* ANA İÇERİK */}
      <div style={{ display: "flex", gap: "30px", padding: "40px", justifyContent: "center" }}>
        {/* FORM KUTUSU */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            minHeight: "500px",
          }}
        >
          <h2 style={{ marginBottom: "20px", color: "#0f172a", fontSize: "20px" }}>
            {isEditing ? "Öğrenci Güncelle" : "Yeni Öğrenci Ekle"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {Object.keys(studentForm).map((key) => (
              <input
                key={key}
                name={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={studentForm[key]}
                onChange={handleInputChange}
                style={{
                  padding: "12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "15px",
                  backgroundColor: "#f8fafc",
                  outlineColor: "#3b82f6",
                }}
              />
            ))}
            <button
              onClick={isEditing ? handleUpdateStudent : handleAddStudent}
              style={{
                padding: "14px",
                backgroundColor: isEditing ? "#facc15" : "#10b981",
                color: "#111827",
                fontWeight: "bold",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              {isEditing ? "📝 Güncelle" : "➕ Ekle"}
            </button>
          </div>
        </div>

        {/* ÖĞRENCİ LİSTESİ */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <h2 style={{ color: "#0f172a", marginBottom: "20px", fontSize: "20px" }}>
            📋 Öğrenci Listesi
          </h2>
          {students.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
              {students.map((student) => {
                const average = student.average ?? 0;
                const color = getAverageColor(average);
                return (
                  <div
                    key={student.id}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      backgroundColor: "#f9fafb",
                      borderLeft: `6px solid ${color}`,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "600", fontSize: "16px", color: "#1e293b" }}>
                        {student.name} {student.surname}
                      </div>
                      <div style={{ fontSize: "14px", color: "#475569" }}>{student.email}</div>
                      <div style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
                        Ortalama:{" "}
                        <strong style={{ color }}>{average.toFixed(2)}</strong> | Devamsızlık:{" "}
                        <strong>{student.attendance ?? 0}</strong>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleEditStudent(student)}
                        style={{
                          backgroundColor: "#3b82f6",
                          border: "none",
                          color: "#fff",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        style={{
                          backgroundColor: "#ef4444",
                          border: "none",
                          color: "#fff",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "#6b7280" }}>Henüz öğrenci eklenmemiş.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
