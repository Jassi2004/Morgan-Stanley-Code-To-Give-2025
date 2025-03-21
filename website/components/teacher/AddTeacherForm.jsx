import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper, { Step } from '../ui/Stepper';
import { Users, Calendar, FileText, Mail, Phone, Briefcase, Heart } from 'lucide-react';

const AddTeacherForm = () => {
  const navigate = useNavigate();
  
  // Initialize teacher state based on the schema
  const [teacher, setTeacher] = useState({
    employeeId: "",
    name: "",
    gender: "",
    email: "",
    password: "",
    avatar: {
      public_id: "",
      secure_url: ""
    },
    designation: "",
    department: "",
    role: "Employee",
    employmentType: "",
    program: "",
    phone: "",
    DOB: "",
    dateOfJoining: "",
    dateOfLeaving: null,
    status: "Active",
    tenure: "",
    workLocation: "",
    emergencyContact: {
      name: "",
      contact: ""
    },
    bloodGroup: ""
  });

  // Form validation states
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setTeacher({
        ...teacher,
        [parent]: {
          ...teacher[parent],
          [child]: value
        }
      });
    } else {
      setTeacher({
        ...teacher,
        [name]: value
      });
    }
  };
  
  // Handle file upload for avatar
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload to your server/cloud storage
      // For demo purposes, we'll create a local URL
      const reader = new FileReader();
      reader.onload = () => {
        setTeacher({
          ...teacher,
          avatar: {
            public_id: `avatar_${Date.now()}`,
            secure_url: reader.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Validate the current step
  const validateStep = (step) => {
    const newErrors = {};
    
    switch(step) {
      case 1: // Basic Information
        if (!teacher.name.trim()) newErrors.name = "Name is required";
        if (!teacher.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(teacher.email)) newErrors.email = "Email is invalid";
        if (!teacher.password) newErrors.password = "Password is required";
        else if (teacher.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        if (!teacher.gender) newErrors.gender = "Gender is required";
        break;
        
      case 2: // Employment Details
        if (!teacher.designation) newErrors.designation = "Designation is required";
        if (!teacher.department) newErrors.department = "Department is required";
        if (!teacher.employmentType) newErrors.employmentType = "Employment type is required";
        if (!teacher.program) newErrors.program = "Program is required";
        break;
        
      case 3: // Personal Details
        if (!teacher.phone) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(teacher.phone)) newErrors.phone = "Phone number must be 10 digits";
        if (!teacher.DOB) newErrors.DOB = "Date of birth is required";
        if (!teacher.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required";
        break;
        
      case 4: // Additional Information
        if (!teacher.workLocation) newErrors.workLocation = "Work location is required";
        if (!teacher.emergencyContact.name) newErrors.emergencyContactName = "Emergency contact name is required";
        if (!teacher.emergencyContact.contact) newErrors.emergencyContactNumber = "Emergency contact number is required";
        else if (!/^\d{10}$/.test(teacher.emergencyContact.contact)) newErrors.emergencyContactNumber = "Contact number must be 10 digits";
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
      // Calculate tenure based on joining date
      const joiningDate = new Date(teacher.dateOfJoining);
      const today = new Date();
      const yearDiff = today.getFullYear() - joiningDate.getFullYear();
      const monthDiff = today.getMonth() - joiningDate.getMonth();
      
      let tenure;
      if (yearDiff > 0) {
        tenure = `${yearDiff} Year${yearDiff > 1 ? 's' : ''}`;
      } else if (monthDiff > 0) {
        tenure = `${monthDiff} Month${monthDiff > 1 ? 's' : ''}`;
      } else {
        tenure = "Less than a month";
      }
      
      // Generate employee ID if not provided
      const employeeId = teacher.employeeId || `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      const finalTeacher = {
        ...teacher,
        employeeId,
        tenure
      };
      
      // Here you would typically send to your API
      console.log("Submitting teacher:", finalTeacher);
      
      // Redirect back to teachers list
      alert("Teacher added successfully!");
      navigate('/teachers');
    }
  };
  
  // Input field component for consistency
  const InputField = ({ label, name, type = "text", value, onChange, error, ...rest }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
  
  // Select field component
  const SelectField = ({ label, name, options, value, onChange, error, ...rest }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...rest}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Add New Teacher</h1>
        <p className="text-gray-600">Enter teacher details using the form below</p>
      </div>
      
      <Stepper
        initialStep={1}
        onStepChange={handleStepChange}
        onFinalStepCompleted={handleSubmit}
        backButtonText="Previous"
        nextButtonText="Next"
        stepCircleContainerClassName="bg-white"
        contentClassName="pb-6"
      >
        {/* Step 1: Basic Information */}
        <Step>
          <div className="p-2">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Users className="mr-2" size={20} />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                name="name"
                value={teacher.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter full name"
              />
              
              <SelectField
                label="Gender"
                name="gender"
                value={teacher.gender}
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
                name="email"
                type="email"
                value={teacher.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter email address"
              />
              
              <InputField
                label="Password"
                name="password"
                type="password"
                value={teacher.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Create password"
              />
              
              <div className="mb-4 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <div className="flex items-center">
                  {teacher.avatar.secure_url ? (
                    <div className="mr-4">
                      <img 
                        src={teacher.avatar.secure_url} 
                        alt="Avatar preview" 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <Users size={24} className="text-gray-500" />
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="p-2 border rounded-lg border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </Step>
        
        {/* Step 2: Employment Details */}
        <Step>
          <div className="p-2">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Briefcase className="mr-2" size={20} />
              Employment Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Employee ID (Optional)"
                name="employeeId"
                value={teacher.employeeId}
                onChange={handleChange}
                placeholder="Auto-generated if left blank"
              />
              
              <InputField
                label="Designation"
                name="designation"
                value={teacher.designation}
                onChange={handleChange}
                error={errors.designation}
                placeholder="e.g. Educator, Program Associate"
              />
              
              <InputField
                label="Department"
                name="department"
                value={teacher.department}
                onChange={handleChange}
                error={errors.department}
                placeholder="e.g. Special Education, Design"
              />
              
              <SelectField
                label="Employment Type"
                name="employmentType"
                value={teacher.employmentType}
                onChange={handleChange}
                error={errors.employmentType}
                options={[
                  { value: "FTE", label: "Full-Time" },
                  { value: "PTE", label: "Part-Time" },
                  { value: "Intern", label: "Intern" },
                  { value: "Consultant", label: "Consultant" }
                ]}
              />
              
              <InputField
                label="Program"
                name="program"
                value={teacher.program}
                onChange={handleChange}
                error={errors.program}
                placeholder="e.g. Job Readiness, Spruha"
              />
              
              <SelectField
                label="Work Location"
                name="workLocation"
                value={teacher.workLocation}
                onChange={handleChange}
                error={errors.workLocation}
                options={[
                  { value: "Academy", label: "Academy" },
                  { value: "Foundation", label: "Foundation" },
                  { value: "Remote", label: "Remote" },
                  { value: "Hybrid", label: "Hybrid" }
                ]}
              />
            </div>
          </div>
        </Step>
        
        {/* Step 3: Personal Details */}
        <Step>
          <div className="p-2">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="mr-2" size={20} />
              Personal Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Phone Number"
                name="phone"
                value={teacher.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="10-digit phone number"
              />
              
              <InputField
                label="Date of Birth"
                name="DOB"
                type="date"
                value={teacher.DOB}
                onChange={handleChange}
                error={errors.DOB}
              />
              
              <InputField
                label="Date of Joining"
                name="dateOfJoining"
                type="date"
                value={teacher.dateOfJoining}
                onChange={handleChange}
                error={errors.dateOfJoining}
              />
              
              <InputField
                label="Date of Leaving (if applicable)"
                name="dateOfLeaving"
                type="date"
                value={teacher.dateOfLeaving || ""}
                onChange={handleChange}
              />
              
              <SelectField
                label="Blood Group"
                name="bloodGroup"
                value={teacher.bloodGroup}
                onChange={handleChange}
                options={[
                  { value: "A+", label: "A+" },
                  { value: "A-", label: "A-" },
                  { value: "B+", label: "B+" },
                  { value: "B-", label: "B-" },
                  { value: "AB+", label: "AB+" },
                  { value: "AB-", label: "AB-" },
                  { value: "O+", label: "O+" },
                  { value: "O-", label: "O-" }
                ]}
              />
            </div>
          </div>
        </Step>
        
        {/* Step 4: Emergency Contact */}
        <Step>
          <div className="p-2">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Phone className="mr-2" size={20} />
              Emergency Contact
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Emergency Contact Name"
                name="emergencyContact.name"
                value={teacher.emergencyContact.name}
                onChange={handleChange}
                error={errors.emergencyContactName}
                placeholder="Full name"
              />
              
              <InputField
                label="Emergency Contact Number"
                name="emergencyContact.contact"
                value={teacher.emergencyContact.contact}
                onChange={handleChange}
                error={errors.emergencyContactNumber}
                placeholder="10-digit phone number"
              />
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-2">Review Information</h3>
                <p className="text-gray-600 mb-4">
                  Please review all the information before submitting. The teacher will be added to the system with status "Active".
                </p>
                
                {/* Summary of entered information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><strong>Name:</strong> {teacher.name || "Not provided"}</p>
                  <p className="mb-2"><strong>Email:</strong> {teacher.email || "Not provided"}</p>
                  <p className="mb-2"><strong>Designation:</strong> {teacher.designation || "Not provided"}</p>
                  <p className="mb-2"><strong>Department:</strong> {teacher.department || "Not provided"}</p>
                  <p className="mb-2"><strong>Program:</strong> {teacher.program || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  );
};

export default AddTeacherForm;