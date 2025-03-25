import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext'; // Adjust 

const StudentRegistrationForm = () => {
  const { darkMode, setDarkMode } = useContext(AppContext);

  const [formData, setFormData] = useState({
    avatar: null,
    firstName: '',
    lastName: '',
    studentEmail: '',
    password: '',
    gender: '',
    dateOfBirth: '',
    UDID: {
      isAvailable: false,
      documentUrl: null
    },
    primaryDiagnosis: '',
    address: '',
    fathersName: '',
    mothersName: '',
    parentEmail: '',
    parentContactNumber: '',
    contactNumber: '',
    allergies: [],
    transport: false,
    sessionType: 'Offline'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      // Handle file upload for avatar and UDID document
      setFormData(prev => ({
        ...prev,
        [name === 'avatar' ? 'avatar' : 'UDID']: name === 'avatar' 
          ? files[0] 
          : { 
              ...prev.UDID, 
              documentUrl: files[0] 
            }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' 
          ? checked 
          : name === 'UDID' 
            ? { ...prev.UDID, [value]: checked }
            : value
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'firstName', 'lastName', 'studentEmail', 'password', 
      'gender', 'dateOfBirth', 'primaryDiagnosis', 
      'address', 'fathersName', 'mothersName', 
      'parentEmail', 'parentContactNumber', 'contactNumber'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.studentEmail && !emailRegex.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Invalid email format';
    }
    if (formData.parentEmail && !emailRegex.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Invalid email format';
    }

    // Contact number validation
    const phoneRegex = /^\d{10}$/;
    if (formData.contactNumber && !phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Phone number must be 10 digits';
    }
    if (formData.parentContactNumber && !phoneRegex.test(formData.parentContactNumber)) {
      newErrors.parentContactNumber = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const formSubmissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (['avatar', 'UDID'].includes(key)) {
        if (formData[key]) {
          if (key === 'avatar') {
            formSubmissionData.append('avatar', formData[key]);
          } else if (formData[key].documentUrl) {
            formSubmissionData.append('UDIDDocument', formData[key].documentUrl);
          }
        }
      } else if (key !== 'avatar') {
        formSubmissionData.append(key, JSON.stringify(formData[key]));
      }
    });

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/student/register', 
        formSubmissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Success notification
      alert('Student registered successfully!');
      
      // Reset form
      setFormData({
        avatar: null,
        firstName: '',
        lastName: '',
        studentEmail: '',
        password: '',
        gender: '',
        dateOfBirth: '',
        UDID: {
          isAvailable: false,
          documentUrl: null
        },
        primaryDiagnosis: '',
        address: '',
        fathersName: '',
        mothersName: '',
        parentEmail: '',
        parentContactNumber: '',
        contactNumber: '',
        allergies: [],
        transport: false,
        sessionType: 'Offline'
      });
    } catch (error) {
      // Error handling
      const errorMessage = error.response?.data?.message || 'Registration failed';
      alert(errorMessage);
      console.error('Registration Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Conditional Styling Helper
  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 border";
    const errorClasses = "border-red-500 focus:ring-red-500";
    const darkClasses = darkMode 
      ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500" 
      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500";
    
    return `${baseClasses} ${
      errors[fieldName] ? errorClasses : darkClasses
    }`;
  };

  const getLabelClasses = () => {
    return darkMode 
      ? 'text-gray-300' 
      : 'text-gray-800 font-semibold';
  };

  // Redesigned File Upload Component
  const FileUpload = ({ name, label, accept, preview, onChange }) => {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(e);
    }
  };

  return (
    <div className="col-span-2">
      <label className={`block mb-2 ${getLabelClasses()}`}>
        {label}
      </label>
      <div className={`w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        darkMode 
          ? 'border-gray-600 bg-gray-700 text-gray-400' 
          : 'border-gray-300 bg-gray-50 text-gray-500'
      }`}>
        <input 
          type="file"
          name={name}
          id={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex items-center justify-center space-x-4">
          {preview ? (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-blue-500">
              <img 
                src={preview} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">{fileName || 'No file chosen'}</p>
          </div>
          <label 
            htmlFor={name}
            className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
              darkMode 
                ? 'bg-blue-700 text-white hover:bg-blue-600' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Change
          </label>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 px-4 py-2 rounded-md transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
            : 'bg-gray-800 text-white hover:bg-gray-700'
        }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className={`shadow-lg rounded-lg p-8 max-w-2xl w-full transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <h2 className={`text-2xl font-bold mb-6 text-center transition-colors duration-300 ${
          darkMode ? 'text-gray-100' : 'text-gray-800'
        }`}>
          Student Registration
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Profile Picture Upload */}
          <FileUpload 
            name="avatar"
            label="Profile Picture"
            accept="image/*"
            preview={formData.avatar ? URL.createObjectURL(formData.avatar) : null}
            onChange={handleChange}
          />

          {/* Existing personal information fields - unchanged */}
          <div className="col-span-1">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              First Name
            </label>
            <input 
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={getInputClasses('firstName')}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          {/* Rest of the existing form fields remain exactly the same */}
          <div className="col-span-1">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Last Name
            </label>
            <input 
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={getInputClasses('lastName')}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {/* Existing contact information fields */}
          <div className="col-span-2">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Student Email
            </label>
            <input 
              type="email"
              name="studentEmail"
              value={formData.studentEmail}
              onChange={handleChange}
              className={getInputClasses('studentEmail')}
              placeholder="Enter student email"
            />
            {errors.studentEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.studentEmail}</p>
            )}
          </div>

          {/* Rest of the fields remain unchanged */}
          <div className="col-span-1">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Password
            </label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={getInputClasses('password')}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Contact Number
            </label>
            <input 
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={getInputClasses('contactNumber')}
              placeholder="Enter contact number"
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
            )}
          </div>

          {/* UDID Section */}
          <div className="col-span-1 flex items-center space-x-2 mt-4">
            <input 
              type="checkbox"
              name="isAvailable"
              checked={formData.UDID.isAvailable}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                UDID: {
                  ...prev.UDID,
                  isAvailable: e.target.checked
                }
              }))}
              className={`h-4 w-4 rounded focus:ring-2 ${
                darkMode 
                  ? 'text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500' 
                  : 'text-blue-600 border-gray-300 focus:ring-blue-500'
              }`}
            />
            <label className={`${getLabelClasses()}`}>UDID Available</label>
          </div>

          {formData.UDID.isAvailable && (
            <FileUpload 
              name="UDIDDocument"
              label="UDID Document"
              accept=".pdf,.png,.jpg,.jpeg"
              preview={formData.UDID.documentUrl ? URL.createObjectURL(formData.UDID.documentUrl) : null}
              onChange={handleChange}
            />
          )}

          {/* Remaining form fields (Diagnosis, Address, Parent Info, etc.) remain exactly the same */}
          {/* ... (all other existing form fields) ... */}
          {/* Diagnosis and Address */}
          <div className="col-span-2">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Primary Diagnosis
            </label>
            <select
              name="primaryDiagnosis"
              value={formData.primaryDiagnosis}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 border ${
                errors.primaryDiagnosis 
                  ? 'border-red-500 focus:ring-red-500' 
                  : darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500' 
                    : 'border-gray-300 bg-white focus:ring-blue-500'
              }`}
            >
              <option value="">Select Primary Diagnosis</option>
              <option value="Autism">Autism</option>
              <option value="Down Syndrome">Down Syndrome</option>
              <option value="ADHD">ADHD</option>
              <option value="Cerebral Palsy">Cerebral Palsy</option>
              <option value="Others">Others</option>
            </select>
            {errors.primaryDiagnosis && (
              <p className="text-red-500 text-sm mt-1">{errors.primaryDiagnosis}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Address
            </label>
            <input 
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={getInputClasses('address')}
              placeholder="Enter full address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Parent Information */}
          <div className="col-span-1">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Father's Name
            </label>
            <input 
              type="text"
              name="fathersName"
              value={formData.fathersName}
              onChange={handleChange}
              className={getInputClasses('fathersName')}
              placeholder="Enter father's name"
            />
            {errors.fathersName && (
              <p className="text-red-500 text-sm mt-1">{errors.fathersName}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Mother's Name
            </label>
            <input 
              type="text"
              name="mothersName"
              value={formData.mothersName}
              onChange={handleChange}
              className={getInputClasses('mothersName')}
              placeholder="Enter mother's name"
            />
            {errors.mothersName && (
              <p className="text-red-500 text-sm mt-1">{errors.mothersName}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Parent Email
            </label>
            <input 
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              className={getInputClasses('parentEmail')}
              placeholder="Enter parent email"
            />
            {errors.parentEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.parentEmail}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Parent Contact Number
            </label>
            <input 
              type="tel"
              name="parentContactNumber"
              value={formData.parentContactNumber}
              onChange={handleChange}
              className={getInputClasses('parentContactNumber')}
              placeholder="Enter parent contact number"
            />
            {errors.parentContactNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.parentContactNumber}</p>
            )}
          </div>

          {/* Optional Details */}
          <div className="col-span-1">
            <label className={`block mb-2 ${getLabelClasses()}`}>
              Session Type
            </label>
            <select
              name="sessionType"
              value={formData.sessionType}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500' 
                  : 'border-gray-300 bg-white focus:ring-blue-500'
              }`}
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="col-span-1 flex items-center space-x-2 mt-6">
            <input 
              type="checkbox"
              name="transport"
              checked={formData.transport}
              onChange={handleChange}
              className={`h-4 w-4 rounded focus:ring-2 ${
                darkMode 
                  ? 'text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500' 
                  : 'text-blue-600 border-gray-300 focus:ring-blue-500'
              }`}
            />
            <label className={`${getLabelClasses()}`}>Transport Required</label>
          </div>

          <div className="col-span-2 mt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md font-semibold transition-colors duration-300 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : darkMode
                    ? 'bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? 'Registering...' : 'Register Student'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;