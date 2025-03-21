import React, { useState, useContext } from 'react';
import Stepper, { Step } from '../ui/Stepper';
import { Users, Calendar, FileText, Mail, Phone, Briefcase, Heart, Home, BookOpen, AlertCircle } from 'lucide-react';
import { AppContext } from '../../context/AppContext'; // Adjust this path to your actual AppContext file location

export default function AddStudentForm() {
  // Get dark mode from context
  const { darkMode } = useContext(AppContext);
  
  // Initialize student state
  const [student, setStudent] = useState({
    StudentId: "",
    firstName: "",
    lastName: "",
    studentEmail: "",
    password: "",
    avatar: {
      public_id: "",
      secure_url: ""
    },
    gender: "",
    UDID: {
      isAvailable: false,
      public_id: "",
      secure_url: ""
    },
    dateOfBirth: "",
    primaryDiagnosis: "",
    comorbidity: false,
    enrollmentYear: "",
    programs: [],
    numberOfSessions: 0,
    timings: "",
    daysOfWeek: ["All"],
    educator: [],
    sessionType: "Offline",
    allergies: [],
    transport: false,
    address: "",
    strengths: [],
    weaknesses: [],
    comments: "",
    status: false,
    guardianDetails: {
      name: "",
      relation: "",
      contactNumber: "",
      parentEmail: ""
    },
    medicalHistory: {
      medications: [],
      surgeries: [],
      notes: ""
    },
    preferredLanguage: "English",
    deviceAccess: []
  });

  // Form validation states
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setStudent(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      setStudent(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setStudent(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle array inputs (like allergies, strengths, weaknesses)
  const handleArrayInput = (field, value) => {
    if (!value.trim()) return;
    
    setStudent(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
    
    // Clear the input field
    document.getElementById(`${field}-input`).value = '';
  };

  // Remove item from array
  const handleRemoveArrayItem = (field, index) => {
    setStudent(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };
  
  // Handle days of week selection
  const handleDaysOfWeekChange = (day) => {
    setStudent(prev => {
      // If "All" is selected, remove all other days
      if (day === "All") {
        return {
          ...prev,
          daysOfWeek: ["All"]
        };
      }
      
      // If any other day is selected, remove "All"
      let newDays = prev.daysOfWeek.filter(d => d !== "All");
      
      // Toggle the selected day
      if (newDays.includes(day)) {
        newDays = newDays.filter(d => d !== day);
      } else {
        newDays.push(day);
      }
      
      // If no days are selected, default to "All"
      if (newDays.length === 0) {
        newDays = ["All"];
      }
      
      return {
        ...prev,
        daysOfWeek: newDays
      };
    });
  };
  
  // Handle file upload for avatar
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setStudent({
          ...student,
          avatar: {
            public_id: `avatar_${Date.now()}`,
            secure_url: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload for UDID
  const handleUDIDUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setStudent({
          ...student,
          UDID: {
            isAvailable: true,
            public_id: `udid_${Date.now()}`,
            secure_url: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1: // Basic Information
        if (!student.firstName.trim()) newErrors.firstName = "First name is required";
        if (!student.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!student.studentEmail.trim()) newErrors.studentEmail = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(student.studentEmail)) newErrors.studentEmail = "Email is invalid";
        if (!student.password) newErrors.password = "Password is required";
        else if (student.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (!student.gender) newErrors.gender = "Gender is required";
        if (!student.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        break;
        
      case 2: // Educational Details
        if (!student.primaryDiagnosis) newErrors.primaryDiagnosis = "Primary diagnosis is required";
        if (!student.enrollmentYear) newErrors.enrollmentYear = "Enrollment year is required";
        if (!student.sessionType) newErrors.sessionType = "Session type is required";
        if (student.timings && !/^\d{2}:\d{2} - \d{2}:\d{2}$/.test(student.timings)) 
          newErrors.timings = "Timings must be in HH:MM - HH:MM format";
        break;
        
      case 3: // Guardian Details
        if (!student.guardianDetails.name) newErrors.guardianName = "Guardian name is required";
        if (!student.guardianDetails.relation) newErrors.guardianRelation = "Guardian relation is required";
        if (!student.guardianDetails.contactNumber) newErrors.guardianContactNumber = "Contact number is required";
        else if (!/^[6-9]\d{9}$/.test(student.guardianDetails.contactNumber)) 
          newErrors.guardianContactNumber = "Contact number must be a valid 10-digit number";
        if (!student.guardianDetails.parentEmail) newErrors.parentEmail = "Parent email is required";
        else if (!/\S+@\S+\.\S+/.test(student.guardianDetails.parentEmail)) 
          newErrors.parentEmail = "Parent email is invalid";
        if (!student.address) newErrors.address = "Address is required";
        break;
        
      case 4: // Medical & Additional Information
        // No required fields in this step
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle step change
  const handleStepChange = (step) => {
    setCurrentStep(step);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (validateStep(4)) {
      // Generate student ID if not provided
      const studentId = student.StudentId || `STU${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      const finalStudent = {
        ...student,
        StudentId: studentId
      };
      
      console.log("Submitting student:", finalStudent);
      alert("Student added successfully!");
    }
  };
  
  // Input field component with dynamic styling based on dark/light mode
  const InputField = ({ label, name, type = "text", value, onChange, error, ...rest }) => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 rounded-lg border ${error ? 'border-red-500' : darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
  
  // Select field component with dynamic styling based on dark/light mode
  const SelectField = ({ label, name, options, value, onChange, error, ...rest }) => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 rounded-lg border ${error ? 'border-red-500' : darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
        {...rest}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );

  // Checkbox component
  const CheckboxField = ({ label, name, checked, onChange, ...rest }) => (
    <div className="mb-4 flex items-center">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className={`h-4 w-4 rounded border-gray-300 ${darkMode ? "text-teal-500 bg-gray-700" : "text-teal-600 bg-gray-100"}`}
        {...rest}
      />
      <label htmlFor={name} className={`ml-2 block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>
    </div>
  );

  // Tag input for array fields
  const TagInput = ({ label, field, items, onAdd, onRemove, placeholder, error }) => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{label}</label>
      <div className="flex mb-2">
        <input
          type="text"
          id={`${field}-input`}
          placeholder={placeholder}
          className={`flex-grow p-2 rounded-l-lg border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd(field, e.target.value))}
        />
        <button 
          type="button" 
          onClick={() => onAdd(field, document.getElementById(`${field}-input`).value)}
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-r-lg px-4 py-2 transition-colors duration-300"
        >
          Add
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center rounded-full px-3 py-1 text-sm ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'}`}
          >
            <span>{item}</span>
            <button 
              type="button" 
              onClick={() => onRemove(field, index)}
              className={`ml-2 rounded-full w-4 h-4 flex items-center justify-center ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-400 hover:bg-gray-500'} text-white`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Add New Student</h1>
        </div>
        
        {/* Stepper container with dynamic styling */}
        <div className={`rounded-xl shadow-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <Stepper
            initialStep={1}
            onStepChange={handleStepChange}
            onFinalStepCompleted={handleSubmit}
            backButtonText="Previous"
            nextButtonText="Next"
            width="100%"
            height="auto"
            stepCircleContainerClassName={darkMode ? "bg-gray-800 border-b border-gray-700" : "bg-white border-b border-gray-200"}
            stepContainerClassName="py-4"
            contentClassName="px-0"
            footerClassName={`border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
            backButtonProps={{ 
              className: darkMode 
                ? "text-gray-400 hover:text-white transition-colors duration-300" 
                : "text-gray-500 hover:text-gray-700 transition-colors duration-300"
            }}
            nextButtonProps={{ 
              className: "bg-teal-500 hover:bg-teal-600 text-white rounded-full px-4 py-2 transition-colors duration-300"
            }}
          >
            {/* Step 1: Basic Information */}
            <Step>
              <div className="p-6 h-96 overflow-y-auto">
                <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                  <Users className="mr-2" size={20} />
                  Basic Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Student ID (Optional)"
                    name="StudentId"
                    value={student.StudentId}
                    onChange={handleChange}
                    placeholder="Auto-generated if left blank"
                  />
                  
                  <InputField
                    label="First Name"
                    name="firstName"
                    value={student.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    placeholder="Enter first name"
                  />
                  
                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={student.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    placeholder="Enter last name"
                  />
                  
                  <SelectField
                    label="Gender"
                    name="gender"
                    value={student.gender}
                    onChange={handleChange}
                    error={errors.gender}
                    options={[
                      { value: "MALE", label: "Male" },
                      { value: "FEMALE", label: "Female" },
                      { value: "OTHER", label: "Other" }
                    ]}
                  />
                  
                  <InputField
                    label="Email"
                    name="studentEmail"
                    type="email"
                    value={student.studentEmail}
                    onChange={handleChange}
                    error={errors.studentEmail}
                    placeholder="Enter email address"
                  />
                  
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={student.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Create password"
                  />
                  
                  <InputField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={student.dateOfBirth}
                    onChange={handleChange}
                    error={errors.dateOfBirth}
                  />
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Profile Picture</label>
                    <div className="flex items-center">
                      {student.avatar.secure_url ? (
                        <div className="mr-4">
                          <img 
                            src={student.avatar.secure_url} 
                            alt="Avatar preview" 
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                          <Users size={24} className={darkMode ? "text-gray-400" : "text-gray-500"} />
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*"
                        className={`p-2 border rounded-lg ${darkMode ? "border-gray-600 bg-gray-700 text-gray-200" : "border-gray-300 bg-gray-100 text-gray-700"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Step>
            
            {/* Step 2: Educational Details */}
            <Step>
              <div className="p-6 h-96 overflow-y-auto">
                <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                  <BookOpen className="mr-2" size={20} />
                  Educational & Diagnostic Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Primary Diagnosis"
                    name="primaryDiagnosis"
                    value={student.primaryDiagnosis}
                    onChange={handleChange}
                    error={errors.primaryDiagnosis}
                    options={[
                      { value: "Autism", label: "Autism" },
                      { value: "Down Syndrome", label: "Down Syndrome" },
                      { value: "ADHD", label: "ADHD" },
                      { value: "Cerebral Palsy", label: "Cerebral Palsy" },
                      { value: "Others", label: "Others" }
                    ]}
                  />
                  
                  <CheckboxField
                    label="Comorbidity"
                    name="comorbidity"
                    checked={student.comorbidity}
                    onChange={handleChange}
                  />
                  
                  <InputField
                    label="Enrollment Year"
                    name="enrollmentYear"
                    type="date"
                    value={student.enrollmentYear}
                    onChange={handleChange}
                    error={errors.enrollmentYear}
                  />
                  
                  <InputField
                    label="Number of Sessions"
                    name="numberOfSessions"
                    type="number"
                    value={student.numberOfSessions}
                    onChange={handleChange}
                    min="0"
                  />
                  
                  <InputField
                    label="Session Timings (HH:MM - HH:MM)"
                    name="timings"
                    value={student.timings}
                    onChange={handleChange}
                    error={errors.timings}
                    placeholder="09:00 - 10:30"
                  />
                  
                  <SelectField
                    label="Session Type"
                    name="sessionType"
                    value={student.sessionType}
                    onChange={handleChange}
                    error={errors.sessionType}
                    options={[
                      { value: "Online", label: "Online" },
                      { value: "Offline", label: "Offline" }
                    ]}
                  />
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Days of Week</label>
                    <div className="flex flex-wrap gap-2">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "All"].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDaysOfWeekChange(day)}
                          className={`px-3 py-1 text-sm rounded-full 
                            ${student.daysOfWeek.includes(day) 
                              ? 'bg-teal-500 text-white' 
                              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>UDID Document (Optional)</label>
                    <div className="flex items-center">
                      <CheckboxField
                        label="UDID Available"
                        name="UDID.isAvailable"
                        checked={student.UDID.isAvailable}
                        onChange={handleChange}
                      />
                    </div>
                    
                    {student.UDID.isAvailable && (
                      <div className="mt-2">
                        {student.UDID.secure_url ? (
                          <div className="flex items-center mb-2">
                            <FileText size={24} className={`mr-2 ${darkMode ? "text-teal-400" : "text-teal-600"}`} />
                            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>Document uploaded</span>
                          </div>
                        ) : null}
                        <input
                          type="file"
                          onChange={handleUDIDUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className={`p-2 border rounded-lg ${darkMode ? "border-gray-600 bg-gray-700 text-gray-200" : "border-gray-300 bg-gray-100 text-gray-700"}`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Step>
            
            {/* Step 3: Guardian Details */}
            <Step>
              <div className="p-6 h-96 overflow-y-auto">
                <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                  <Users className="mr-2" size={20} />
                  Guardian & Contact Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Guardian Name"
                    name="guardianDetails.name"
                    value={student.guardianDetails.name}
                    onChange={handleChange}
                    error={errors.guardianName}
                    placeholder="Enter guardian's full name"
                  />
                  
                  <InputField
                    label="Relation to Student"
                    name="guardianDetails.relation"
                    value={student.guardianDetails.relation}
                    onChange={handleChange}
                    error={errors.guardianRelation}
                    placeholder="e.g. Mother, Father, Guardian"
                  />
                  
                  <InputField
                    label="Contact Number"
                    name="guardianDetails.contactNumber"
                    value={student.guardianDetails.contactNumber}
                    onChange={handleChange}
                    error={errors.guardianContactNumber}
                    placeholder="10-digit number"
                  />
                  
                  <InputField
                    label="Parent Email"
                    name="guardianDetails.parentEmail"
                    type="email"
                    value={student.guardianDetails.parentEmail}
                    onChange={handleChange}
                    error={errors.parentEmail}
                    placeholder="Enter parent's email address"
                  />
                  
                  <div className="md:col-span-2">
                    <InputField
                      label="Address"
                      name="address"
                      value={student.address}
                      onChange={handleChange}
                      error={errors.address}
                      placeholder="Enter full address"
                    />
                  </div>
                  
                  <CheckboxField
                    label="Requires Transport"
                    name="transport"
                    checked={student.transport}
                    onChange={handleChange}
                  />
                  
                  <SelectField
                    label="Preferred Language"
                    name="preferredLanguage"
                    value={student.preferredLanguage}
                    onChange={handleChange}
                    options={[
                      { value: "English", label: "English" },
                      { value: "Hindi", label: "Hindi" },
                      { value: "Marathi", label: "Marathi" },
                      { value: "Sign Language", label: "Sign Language" },
                      { value: "Other", label: "Other" }
                    ]}
                  />
                  
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Device Access</label>
                    <div className="flex flex-wrap gap-2">
                      {["Tablet", "Laptop", "Smartphone", "Hearing Aid", "Braille Device"].map((device) => (
                        <button
                          key={device}
                          type="button"
                          onClick={() => {
                            setStudent(prev => {
                              if (prev.deviceAccess.includes(device)) {
                                return {
                                  ...prev,
                                  deviceAccess: prev.deviceAccess.filter(d => d !== device)
                                };
                              } else {
                                return {
                                  ...prev,
                                  deviceAccess: [...prev.deviceAccess, device]
                                };
                              }
                            });
                          }}
                          className={`px-3 py-1 text-sm rounded-full 
                            ${student.deviceAccess.includes(device) 
                              ? 'bg-teal-500 text-white' 
                              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                          {device}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Step>
            
            {/* Step 4: Medical & Additional Information */}
            <Step>
              <div className="p-6 h-96 overflow-y-auto">
                <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                  <Heart className="mr-2" size={20} />
                  Medical & Additional Information
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <TagInput
                    label="Allergies"
                    field="allergies"
                    items={student.allergies}
                    onAdd={handleArrayInput}
                    onRemove={handleRemoveArrayItem}
                    placeholder="Type allergy and press Enter or Add"
                  />
                  
                  <TagInput
                    label="Medications"
                    field="medicalHistory.medications"
                    items={student.medicalHistory.medications}
                    onAdd={(field, value) => {
                      if (!value.trim()) return;
                      setStudent(prev => ({
                        ...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          medications: [...prev.medicalHistory.medications, value]
                        }
                      }));
                      document.getElementById(`${field}-input`).value = '';
                    }}
                    onRemove={(field, index) => {
                      setStudent(prev => ({
                        ...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          medications: prev.medicalHistory.medications.filter((_, i) => i !== index)
                        }
                      }));
                    }}
                    placeholder="Enter medication and press Enter or Add"
                  />
                  
                  <TagInput
                    label="Previous Surgeries"
                    field="medicalHistory.surgeries"
                    items={student.medicalHistory.surgeries}
                    onAdd={(field, value) => {
                      if (!value.trim()) return;
                      setStudent(prev => ({
                        ...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          surgeries: [...prev.medicalHistory.surgeries, value]
                        }
                      }));
                      document.getElementById(`${field}-input`).value = '';
                    }}
                    onRemove={(field, index) => {
                      setStudent(prev => ({...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          surgeries: prev.medicalHistory.surgeries.filter((_, i) => i !== index)
                        }
                      }));
                    }}
                    placeholder="Enter surgery details and press Enter or Add"
                  />
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Medical Notes</label>
                    <textarea
                      name="medicalHistory.notes"
                      value={student.medicalHistory.notes}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full p-2 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                      placeholder="Any additional medical information"
                    ></textarea>
                  </div>
                  
                  <TagInput
                    label="Strengths"
                    field="strengths"
                    items={student.strengths}
                    onAdd={handleArrayInput}
                    onRemove={handleRemoveArrayItem}
                    placeholder="Enter student's strengths and press Enter or Add"
                  />
                  
                  <TagInput
                    label="Areas for Improvement"
                    field="weaknesses"
                    items={student.weaknesses}
                    onAdd={handleArrayInput}
                    onRemove={handleRemoveArrayItem}
                    placeholder="Enter areas for improvement and press Enter or Add"
                  />
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Additional Comments</label>
                    <textarea
                      name="comments"
                      value={student.comments}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full p-2 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                      placeholder="Any additional information or special instructions"
                    ></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Review Information</h3>
                    <p className={darkMode ? "text-gray-400 mb-4" : "text-gray-500 mb-4"}>
                      Please review all the information before submitting. You can go back to previous steps to make changes if needed.
                    </p>
                    
                    {/* Summary of entered information */}
                    <div className={`p-4 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p className="mb-2">
                          <strong className={darkMode ? "text-teal-400" : "text-teal-600"}>Name:</strong> 
                          <span className={darkMode ? "text-gray-200 ml-1" : "text-gray-700 ml-1"}>
                            {student.firstName} {student.lastName || "Not provided"}
                          </span>
                        </p>
                        <p className="mb-2">
                          <strong className={darkMode ? "text-teal-400" : "text-teal-600"}>Email:</strong>
                          <span className={darkMode ? "text-gray-200 ml-1" : "text-gray-700 ml-1"}>
                            {student.studentEmail || "Not provided"}
                          </span>
                        </p>
                        <p className="mb-2">
                          <strong className={darkMode ? "text-teal-400" : "text-teal-600"}>Diagnosis:</strong>
                          <span className={darkMode ? "text-gray-200 ml-1" : "text-gray-700 ml-1"}>
                            {student.primaryDiagnosis || "Not provided"}
                          </span>
                        </p>
                        <p className="mb-2">
                          <strong className={darkMode ? "text-teal-400" : "text-teal-600"}>Guardian:</strong>
                          <span className={darkMode ? "text-gray-200 ml-1" : "text-gray-700 ml-1"}>
                            {student.guardianDetails.name || "Not provided"}
                          </span>
                        </p>
                        <p className="mb-2">
                          <strong className={darkMode ? "text-teal-400" : "text-teal-600"}>Enrollment:</strong>
                          <span className={darkMode ? "text-gray-200 ml-1" : "text-gray-700 ml-1"}>
                            {student.enrollmentYear ? new Date(student.enrollmentYear).toLocaleDateString() : "Not provided"}
                          </span>
                        </p>
                        <p className="mb-2">
                          <strong className={darkMode ? "text-teal-400" : "text-teal-600"}>Session Type:</strong>
                          <span className={darkMode ? "text-gray-200 ml-1" : "text-gray-700 ml-1"}>
                            {student.sessionType}
                          </span>
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <CheckboxField
                          label="Set student status as active"
                          name="status"
                          checked={student.status}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      </div>
    </div>
  );
}