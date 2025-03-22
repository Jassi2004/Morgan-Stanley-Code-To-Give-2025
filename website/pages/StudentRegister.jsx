import React, { useState } from "react";
import axios from "axios";

function StudentRegister() {
  const [formData, setFormData] = useState({
    StudentId: "",
    firstName: "",
    lastName: "",
    studentEmail: "",
    password: "",
    gender: "",
    dateOfBirth: "",
    primaryDiagnosis: "",
    enrollmentYear: "",
    address: "",
    guardianDetails: "",
    preferredLanguage: "English",
    transport: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/student/register", formData);
      alert("Student registered successfully!");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error during registration: " + (error.response?.data?.message || error.message));
    }
  };

  const diagnosisOptions = [
    "Autism Spectrum Disorder (ASD)",
    "Mild ASD",
    "Learning Disability (LD)",
    "Down Syndrome",
    "Muscular Dystrophy",
    "Intellectual Disability (ID)",
    "Slow Learner",
    "ADHD",
    "Mental Retardation (MR)",
    "Mild MR",
    "Mild ID",
    "Cerebral Palsy (CP)",
    "Mild CP",
    "Delayed Milestones",
    "Global Developmental Delay (GDD)",
    "Speech Delay",
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
      <div className="card w-full max-w-md p-8 shadow-lg animate-fade-in">
        <h2 className="text-2xl font-semibold text-center mb-6">Student Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          

          <div className="input-group">
            <label className="form-label" htmlFor="firstName">First Name:</label>
            <input
              className="form-input"
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your First Name"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="lastName">Last Name:</label>
            <input
              className="form-input"
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your Last Name"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="studentEmail">Email:</label>
            <input
              className="form-input"
              id="studentEmail"
              name="studentEmail"
              type="email"
              value={formData.studentEmail}
              onChange={handleChange}
              placeholder="Enter your Email"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="password">Password:</label>
            <input
              className="form-input"
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="gender">Gender:</label>
            <select
              className="form-input"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="dateOfBirth">Date of Birth:</label>
            <input
              className="form-input"
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="primaryDiagnosis">Primary Diagnosis:</label>
            <select
              className="form-input"
              id="primaryDiagnosis"
              name="primaryDiagnosis"
              value={formData.primaryDiagnosis}
              onChange={handleChange}
              required
            >
              <option value="">Select Diagnosis</option>
              {diagnosisOptions.map((diagnosis) => (
                <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="form-label" htmlFor="transport">Needs Transport:</label>
            <select
              className="form-input"
              id="transport"
              name="transport"
              value={formData.transport}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>

          <div className="text-center text-sm text-[var(--color-text-accent)]">
            Already have an account?{" "}
            <a href="/login" className="text-[var(--color-brand)] hover:underline">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentRegister;
