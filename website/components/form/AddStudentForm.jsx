import React, { useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Users, Calendar, FileText, Mail, Phone, Briefcase, Heart, Home, BookOpen, AlertCircle } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import Stepper from './Stepper'; // Import the updated Stepper component

// Validation schemas for each step
const validationSchemas = {
  step1: Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    studentEmail: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    gender: Yup.string().required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    StudentId: Yup.string().required('Student ID is required'),
  }),
  step2: Yup.object({
    primaryDiagnosis: Yup.string().required('Primary diagnosis is required'),
    enrollmentYear: Yup.string().required('Enrollment year is required'),
    sessionType: Yup.string().required('Session type is required'),
    programs: Yup.array(),
    numberOfSessions: Yup.number(),
    timings: Yup.string(),
    daysOfWeek: Yup.array(),
    educator: Yup.array(),
  }),
  step3: Yup.object({
    guardianDetails: Yup.object({
      name: Yup.string().required('Guardian name is required'),
      relation: Yup.string().required('Guardian relation is required'),
      contactNumber: Yup.string()
        .matches(/^[6-9]\d{9}$/, 'Contact number must be a valid 10-digit number')
        .required('Contact number is required'),
      parentEmail: Yup.string().email('Invalid email').required('Parent email is required'),
    }),
    address: Yup.string().required('Address is required'),
    transport: Yup.boolean(),
  }),
  step4: Yup.object({
    medicalHistory: Yup.object({
      medications: Yup.array(),
      surgeries: Yup.array(),
      notes: Yup.string(),
    }),
    allergies: Yup.array(),
    strengths: Yup.array(),
    weaknesses: Yup.array(),
    comments: Yup.string(),
    preferredLanguage: Yup.string(),
    deviceAccess: Yup.array(),
  }),
};

export default function AddStudentForm() {
  const { darkMode } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [UDIDPreview, setUDIDPreview] = useState(null);

  const initialValues = {
    StudentId: '',
    firstName: '',
    lastName: '',
    studentEmail: '',
    password: '',
    avatar: null,
    gender: '',
    UDID: {
      isAvailable: false,
      file: null,
    },
    dateOfBirth: '',
    primaryDiagnosis: '',
    comorbidity: false,
    enrollmentYear: '',
    programs: [],
    numberOfSessions: 0,
    timings: '',
    daysOfWeek: ['All'],
    educator: [],
    sessionType: 'Offline',
    allergies: [],
    transport: false,
    address: '',
    strengths: [],
    weaknesses: [],
    comments: '',
    guardianDetails: {
      name: '',
      relation: '',
      contactNumber: '',
      parentEmail: '',
    },
    medicalHistory: {
      medications: [],
      surgeries: [],
      notes: '',
    },
    preferredLanguage: 'English',
    deviceAccess: [],
  };

  const FormField = ({ label, name, type = "text", ...props }) => (
    <div className="mb-4">
      <label htmlFor={name} className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        className={`w-full p-2 rounded-lg border ${
          darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
        } focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
        {...props}
      />
    </div>
  );
  
  const ArrayField = ({ label, name, placeholder }) => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>
      <Field name={name}>
        {({ field, form }) => (
          <div>
            <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
                className={`w-full p-2 rounded-lg border ${
                  darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                } focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    e.preventDefault();
                    const values = [...field.value, e.target.value];
                    form.setFieldValue(name, values);
                    e.target.value = '';
                  }
                }}
        />
        <button 
          type="button" 
                onClick={() => {
                  const input = document.querySelector(`input[placeholder="${placeholder}"]`);
                  if (input.value) {
                    const values = [...field.value, input.value];
                    form.setFieldValue(name, values);
                    input.value = '';
                  }
                }}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 rounded-lg transition-colors duration-300"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
              {field.value.map((item, index) => (
          <div 
            key={index} 
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                  }`}
          >
            <span>{item}</span>
            <button 
              type="button" 
                    onClick={() => {
                      const values = field.value.filter((_, i) => i !== index);
                      form.setFieldValue(name, values);
                    }}
                    className="text-red-500 hover:text-red-600 transition-colors duration-300"
            >
              ×
            </button>
          </div>
        ))}
      </div>
          </div>
        )}
      </Field>
    </div>
  );
  
  const renderStepContent = (step, errors, touched) => {
    switch (step) {
      case 1:
  return (
          <>
                <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                  <Users className="mr-2" size={20} />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  label="Student ID"
                    name="StudentId"
                  placeholder="Enter student ID"
                />
                {errors.StudentId && touched.StudentId && (
                  <div className="text-red-500 text-sm mt-1">{errors.StudentId}</div>
                )}
              </div>
              <div>
                <FormField
                    label="First Name"
                    name="firstName"
                    placeholder="Enter first name"
                />
                {errors.firstName && touched.firstName && (
                  <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>
                )}
              </div>
              <div>
                <FormField
                    label="Last Name"
                    name="lastName"
                    placeholder="Enter last name"
                />
                {errors.lastName && touched.lastName && (
                  <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Gender
                </label>
                <Field
                  as="select"
                    name="gender"
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Field>
                {errors.gender && touched.gender && (
                  <div className="text-red-500 text-sm mt-1">{errors.gender}</div>
                )}
              </div>
              <div>
                <FormField
                    label="Email"
                    name="studentEmail"
                    type="email"
                    placeholder="Enter email address"
                />
                {errors.studentEmail && touched.studentEmail && (
                  <div className="text-red-500 text-sm mt-1">{errors.studentEmail}</div>
                )}
              </div>
              <div>
                <FormField
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create password"
                />
                {errors.password && touched.password && (
                  <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                )}
              </div>
              <div>
                <FormField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                />
                {errors.dateOfBirth && touched.dateOfBirth && (
                  <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>
                )}
                        </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Avatar
                </label>
                      <input
                        type="file"
                        accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                />
                {avatarPreview && (
                  <img src={avatarPreview} alt="Avatar preview" className="mt-2 w-20 h-20 rounded-full object-cover" />
                )}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
                <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                  <BookOpen className="mr-2" size={20} />
              Educational Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                    label="Primary Diagnosis"
                    name="primaryDiagnosis"
                  placeholder="Enter primary diagnosis"
                />
                {errors.primaryDiagnosis && touched.primaryDiagnosis && (
                  <div className="text-red-500 text-sm mt-1">{errors.primaryDiagnosis}</div>
                )}
              </div>
              <div>
                <FormField
                    label="Enrollment Year"
                    name="enrollmentYear"
                  type="number"
                  min={2000}
                  max={new Date().getFullYear()}
                />
                {errors.enrollmentYear && touched.enrollmentYear && (
                  <div className="text-red-500 text-sm mt-1">{errors.enrollmentYear}</div>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Session Type
                </label>
                <Field
                  as="select"
                  name="sessionType"
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </Field>
              </div>
              <div>
                <FormField
                    label="Number of Sessions"
                    name="numberOfSessions"
                    type="number"
                  min={0}
                />
              </div>
              <div>
                <FormField
                  label="Timings"
                    name="timings"
                  placeholder="HH:MM - HH:MM"
                />
                  </div>
                  <div className="md:col-span-2">
                <ArrayField
                  label="Programs"
                  name="programs"
                  placeholder="Add program"
                      />
                    </div>
              <div className="md:col-span-2">
                <ArrayField
                  label="Educators"
                  name="educator"
                  placeholder="Add educator"
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
                <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
              <Home className="mr-2" size={20} />
              Guardian Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                    label="Guardian Name"
                    name="guardianDetails.name"
                  placeholder="Enter guardian name"
                />
                {errors.guardianDetails?.name && touched.guardianDetails?.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.guardianDetails.name}</div>
                )}
              </div>
              <div>
                <FormField
                  label="Relation"
                    name="guardianDetails.relation"
                  placeholder="Enter relation"
                />
                {errors.guardianDetails?.relation && touched.guardianDetails?.relation && (
                  <div className="text-red-500 text-sm mt-1">{errors.guardianDetails.relation}</div>
                )}
              </div>
              <div>
                <FormField
                    label="Contact Number"
                    name="guardianDetails.contactNumber"
                  type="tel"
                  placeholder="Enter contact number"
                />
                {errors.guardianDetails?.contactNumber && touched.guardianDetails?.contactNumber && (
                  <div className="text-red-500 text-sm mt-1">{errors.guardianDetails.contactNumber}</div>
                )}
              </div>
              <div>
                <FormField
                    label="Parent Email"
                    name="guardianDetails.parentEmail"
                    type="email"
                  placeholder="Enter parent email"
                />
                {errors.guardianDetails?.parentEmail && touched.guardianDetails?.parentEmail && (
                  <div className="text-red-500 text-sm mt-1">{errors.guardianDetails.parentEmail}</div>
                )}
              </div>
                  <div className="md:col-span-2">
                <FormField
                      label="Address"
                      name="address"
                  as="textarea"
                  rows={3}
                  placeholder="Enter address"
                />
                {errors.address && touched.address && (
                  <div className="text-red-500 text-sm mt-1">{errors.address}</div>
                )}
                  </div>
              <div>
                <label className={`flex items-center space-x-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  <Field type="checkbox" name="transport" />
                  <span>Requires Transport</span>
                </label>
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
                <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-teal-400" : "text-teal-600"}`}>
                  <Heart className="mr-2" size={20} />
                  Medical & Additional Information
                </h2>
                <div className="grid grid-cols-1 gap-4">
              <div>
                <ArrayField
                    label="Medications"
                  name="medicalHistory.medications"
                  placeholder="Add medication"
                />
              </div>
              <div>
                <ArrayField
                  label="Surgeries"
                  name="medicalHistory.surgeries"
                  placeholder="Add surgery"
                />
              </div>
              <div>
                <FormField
                  label="Medical Notes"
                      name="medicalHistory.notes"
                  as="textarea"
                  rows={3}
                  placeholder="Enter medical notes"
                />
              </div>
              <div>
                <ArrayField
                  label="Allergies"
                  name="allergies"
                  placeholder="Add allergy"
                />
                  </div>
              <div>
                <ArrayField
                    label="Strengths"
                  name="strengths"
                  placeholder="Add strength"
                />
              </div>
              <div>
                <ArrayField
                    label="Areas for Improvement"
                  name="weaknesses"
                  placeholder="Add area for improvement"
                />
              </div>
              <div>
                <FormField
                  label="Additional Comments"
                      name="comments"
                  as="textarea"
                  rows={3}
                  placeholder="Enter additional comments"
                        />
                      </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Preferred Language
                </label>
                <Field
                  as="select"
                  name="preferredLanguage"
                  className={`w-full p-2 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Other">Other</option>
                </Field>
                    </div>
              <div>
                <ArrayField
                  label="Device Access"
                  name="deviceAccess"
                  placeholder="Add device"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

return (
  <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}>
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Add New Student</h1>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas[`step${currentStep}`]}
        onSubmit={(values, { setSubmitting }) => {
          console.log('Formik onSubmit triggered, currentStep:', currentStep);
          // Only handle final submission
          if (currentStep === 4) {
            console.log('Final step submission, showing alert');
            console.log('Form Values:', values);
            alert('Student information saved successfully!');
            setSubmitting(false);
            return;
          }
          // For non-final steps, move to next step
          setCurrentStep(currentStep + 1);
          setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting, values }) => (
          <Form noValidate>
            <div className={`rounded-xl shadow-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="p-6">
                <Stepper 
                  activeStep={currentStep}
                  onStepChange={(step) => {
                    console.log('Stepper onStepChange called, new step:', step);
                    if (step <= 4) {
                      setCurrentStep(step);
                    }
                  }}
                >
                  <Stepper.Step
                    label="Basic Information"
                    icon={<Users size={16} />}
                  />
                  <Stepper.Step
                    label="Educational Details"
                    icon={<BookOpen size={16} />}
                  />
                  <Stepper.Step
                    label="Guardian Details"
                    icon={<Home size={16} />}
                  />
                  <Stepper.Step
                    label="Medical Information"
                    icon={<Heart size={16} />}
                  />
                </Stepper>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                {renderStepContent(currentStep, errors, touched)}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  </div>
);
}