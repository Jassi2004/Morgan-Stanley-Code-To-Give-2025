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
    employmentType: "",
    program: "",
    phone: "",
    DOB: "",
    dateOfJoining: "",
    workLocation: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/v1/employee/create-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, status: "Active" }), // ✅ Status set automatically
    });

    console.log("Response : ", response);

    if (response.status == 201) {
      window.alert("Employee added successfully")
    } else {
      alert("Registration failed");
    }
  };

  const dropdownOptions = {
    gender: ["MALE", "FEMALE"],
    designation: [
      "Founder", "Co-Founder", "Program Director", "Manager",
      "Program Associate", "Jr. Program Associate", "Admin", "Educator"
    ],
    department: ["Management", "Admin", "Special Education", "Design"],
    employmentType: ["Trustee", "FTE", "Intern", "Educator", "Volunteer"],
    program: ["Multi", "Job Readiness", "Vocation", "Spruha", "Suyog", "Sameti", "Shaale", "Siddhi", "Sattva"],
    workLocation: ["Foundation", "Academy"],
    bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Employee Registration
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {Object.keys(formData).map((field) => (
            field !== "status" && ( // ❌ Status is removed from user input
              <div className="col-span-2 sm:col-span-1" key={field}>
                <label className="block text-gray-700 dark:text-gray-300 font-medium capitalize mb-1">
                  {field.replace(/([A-Z])/g, " $1")}:
                </label>
                {dropdownOptions[field] ? (
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Select {field}</option>
                    {dropdownOptions[field].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field === "DOB" || field === "dateOfJoining" ? "date" : field === "password" ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    required
                  />
                )}
              </div>
            )
          ))}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
