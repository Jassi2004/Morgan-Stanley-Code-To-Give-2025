import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeRegister() {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    gender: "",
    email: "",
    password: "",
    designation: "",
    department: "",
    role: "",
    employmentType: "",
    program: "",
    phone: "",
    DOB: "",
    dateOfJoining: "",
    status: "",
    workLocation: "",
    bloodGroup: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/v1/employee/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      navigate("/");
    } else {
      alert("Registration failed");
    }
  };

  const dropdownOptions = {
    gender: ["MALE", "FEMALE"],
    designation: [
      "Founder", "Co-Founder", "Program Director", "Manager", "Program Associate",
      "Jr. Program Associate", "Admin", "Educator"
    ],
    department: ["Management", "Admin", "Special Education", "Design"],
    role: ["Admin", "Hr", "Employee"],
    employmentType: ["Trustee", "FTE", "Intern", "Educator", "Volunteer"],
    program: ["Multi", "Job Readiness", "Vocation", "Spruha", "Suyog", "Sameti", "Shaale", "Siddhi", "Sattva"],
    status: ["Active", "Discontinued", "Temporary Discontinue"],
    workLocation: ["Foundation", "Academy"],
    bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Employee Registration
        </h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-gray-700 dark:text-gray-300 capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              {dropdownOptions[field] ? (
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select {field}</option>
                  {dropdownOptions[field].map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.includes("date") ? "date" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
