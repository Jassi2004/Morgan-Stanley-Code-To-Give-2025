// import React, { useContext, useState } from 'react';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { Users, Calendar, FileText, Mail, Phone, Briefcase, Heart, Home, BookOpen, AlertCircle } from 'lucide-react';
// import { AppContext } from '../../context/AppContext';
// import Stepper from './Stepper'; // Import the Stepper component

// // Validation schemas for each step
// const validationSchemas = {
//   step1: Yup.object({
//     employeeId: Yup.string().required('Employee ID is required'),
//     name: Yup.string().required('Name is required'),
//     email: Yup.string().email('Invalid email address').required('Email is required'),
//     password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
//     gender: Yup.string().required('Gender is required'),
//     phone: Yup.string()
//       .matches(/^[6-9]\d{9}$/, 'Phone number must be a valid 10-digit number')
//       .required('Phone number is required'),
//   }),
//   step2: Yup.object({
//     designation: Yup.string().required('Designation is required'),
//     department: Yup.string().required('Department is required'),
//     employmentType: Yup.string().required('Employment type is required'),
//     program: Yup.string().required('Program is required'),
//     workLocation: Yup.string().required('Work location is required'),
//   }),
//   step3: Yup.object({
//     DOB: Yup.string().required('Date of birth is required'),
//     dateOfJoining: Yup.string().required('Date of joining is required'),
//     emergencyContact: Yup.object({
//       name: Yup.string().required('Emergency contact name is required'),
//       contact: Yup.string()
//         .matches(/^[6-9]\d{9}$/, 'Contact number must be a valid 10-digit number')
//         .required('Emergency contact number is required'),
//     }),
//   }),
//   step4: Yup.object({
//     bloodGroup: Yup.string().required('Blood group is required'),
//     status: Yup.string().required('Status is required'),
//   }),
// };

// export default function AddTeacherForm() {
//   const { darkMode } = useContext(AppContext);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [avatarPreview, setAvatarPreview] = useState(null);

//   const initialValues = {
//     employeeId: '',
//     name: '',
//     gender: '',
//     email: '',
//     password: '',
//     avatar: null,
//     designation: 'Educator',
//     department: 'Special Education',
//     role: 'Employee',
//     employmentType: '',
//     program: '',
//     phone: '',
//     DOB: '',
//     dateOfJoining: '',
//     dateOfLeaving: '',
//     status: 'Active',
//     workLocation: '',
//     emergencyContact: {
//       name: '',
//       contact: ''
//     },
//     bloodGroup: ''
//   };

//   const FormField = ({ label, name, type = "text", ...props }) => (
//     <div className="mb-4">
//       <label htmlFor={name} className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
//         {label}
//       </label>
//       <Field
//         id={name}
//         name={name}
//         type={type}
//         className={`w-full p-2 rounded-lg border ${
//           darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
//         } focus:ring-2 focus:ring-brand focus:border-brand`}
//         {...props}
//       />
//     </div>
//   );
  
//   const renderStepContent = (step, errors, touched) => {
//     switch (step) {
//       case 1:
//         return (
//           <>
//             <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-brand-light" : "text-brand"}`}>
//               <Users className="mr-2" size={20} />
//               Basic Information
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <FormField
//                   label="Employee ID"
//                   name="employeeId"
//                   placeholder="Enter employee ID"
//                 />
//                 {errors.employeeId && touched.employeeId && (
//                   <div className="text-danger text-sm mt-1">{errors.employeeId}</div>
//                 )}
//               </div>
//               <div>
//                 <FormField
//                   label="Full Name"
//                   name="name"
//                   placeholder="Enter full name"
//                 />
//                 {errors.name && touched.name && (
//                   <div className="text-danger text-sm mt-1">{errors.name}</div>
//                 )}
//               </div>
//               <div>
//                 <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
//                   Gender
//                 </label>
//                 <Field
//                   as="select"
//                   name="gender"
//                   className={`w-full p-2 rounded-lg border ${
//                     darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
//                   } focus:ring-2 focus:ring-brand focus:border-brand`}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="MALE">Male</option>
//                   <option value="FEMALE">Female</option>
//                   <option value="OTHER">Other</option>
//                 </Field>
//                 {errors.gender && touched.gender && (
//                   <div className="text-danger text-sm mt-1">{errors.gender}</div>
//                 )}
//               </div>
//               <div>
//                 <FormField
//                   label="Email"
//                   name="email"
//                   type="email"
//                   placeholder="Enter email address"
//                 />
//                 {errors.email && touched.email && (
//                   <div className="text-danger text-sm mt-1">{errors.email}</div>
//                 )}
//               </div>
//               <div>
//                 <FormField
//                   label="Password"
//                   name="password"
//                   type="password"
//                   placeholder="Create password"
//                 />
//                 {errors.password && touched.password && (
//                   <div className="text-danger text-sm mt-1">{errors.password}</div>
//                 )}
//               </div>
//               <div>
//                 <FormField
//                   label="Phone Number"
//                   name="phone"
//                   placeholder="Enter phone number"
//                 />
//                 {errors.phone && touched.phone && (
//                   <div className="text-danger text-sm mt-1">{errors.phone}</div>
//                 )}
//               </div>
//               <div>
//                 <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
//                   Avatar
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       setAvatarPreview(URL.createObjectURL(file));
//                     }
//                   }}
//                   className={`w-full p-2 rounded-lg border ${
//                     darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
//                   }`}
//                 />
//                 {avatarPreview && (
//                   <img src={avatarPreview} alt="Avatar preview" className="mt-2 w-20 h-20 rounded-full object-cover" />
//                 )}
//               </div>
//             </div>
//           </>
//         );
//       case 2:
//         return (
//           <>
//             <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-brand-light" : "text-brand"}`}>
//               <Briefcase className="mr-2" size={20} />
//               Employment Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <FormField
//                   label="Designation"
//                   name="designation"
//                   value="Educator"
//                   disabled
//                 />
//               </div>
//               <div>
//                 <FormField
//                   label="Department"
//                   name="department"
//                   value="Special Education"
//                   disabled
//                 />
//               </div>
//               <div>
//                 <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
//                   Employment Type
//                 </label>
//                 <Field
//                   as="select"
//                   name="employmentType"
//                   className={`w-full p-2 rounded-lg border ${
//                     darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
//                   } focus:ring-2 focus:ring-brand focus:border-brand`}
//                 >
//                   <option value="">Select Employment Type</option>
//                   <option value="Full-Time">Full-Time</option>
//                   <option value="Part-Time">Part-Time</option>
//                   <option value="Contract">Contract</option>
//                 </Field>
//                 {errors.employmentType && touched.employmentType && (
//                   <div className="text-danger text-sm mt-1">{errors.employmentType}</div>
//                 )}
//               </div>
//               <div>
//                 <FormField
//                   label="Program"
//                   name="program"
//                   placeholder="Enter program"
//                 />
//                 {errors.program && touched.program && (
//                   <div className="text-danger text-sm mt-1">{errors.program}</div>
//                 )}
//               </div>
//               <div>
//                 <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
//                   Work Location
//                 </label>
//                 <Field
//                   as="select"
//                   name="workLocation"
//                   className={`w-full p-2 rounded-lg border ${
//                     darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
//                   } focus:ring-2 focus:ring-brand focus:border-brand`}
//                 >
//                   <option value="">Select Work Location</option>
//                   <option value="Foundation">Foundation</option>
//                   <option value="Academy">Academy</option>
//                   <option value="Remote">Remote</option>
//                   <option value="Hybrid">Hybrid</option>
//                 </Field>
//                 {errors.workLocation && touched.workLocation && (
//                   <div className="text-danger text-sm mt-1">{errors.workLocation}</div>
//                 )}
//               </div>
//             </div>
//           </>
//         );
//       case 3:
//         return (
//           <>
//             <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-brand-light" : "text-brand"}`}>
//               <Calendar className="mr-2" size={20} />
//               Personal Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <FormField
//                   label="Date of Birth"
//                   name="DOB"
//                   type="date"
//                 />
//                 {errors.DOB && touched.DOB && (
//                   <div className="text-danger text-sm mt-1">{errors.DOB}</div>
//                 )}
//               </div>
//               <div>
//                 <FormField
//                   label="Date of Joining"
//                   name="dateOfJoining"
//                   type="date"
//                 />
//                 {errors.dateOfJoining && touched.dateOfJoining && (
//                   <div className="text-danger text-sm mt-1">{errors.dateOfJoining}</div>
//                 )}
//               </div>
//               <div>
//                 <FormField
//                   label="Date of Leaving"
//                   name="dateOfLeaving"
//                   type="date"
//                 />
//               </div>
//               <div>
//                 <FormField
//                   label="Emergency Contact Name"
//                   name="emergencyContact.name"
//                   placeholder="Enter emergency contact name"
//                 />
//                 {errors.emergencyContact?.name && touched.emergencyContact?.name && (
//                   <div className="text-danger text-sm mt-1">{errors.emergencyContact.name}</div>
//                 )}
//               </div>
//               <div>
//                 <FormField
//                   label="Emergency Contact Number"
//                   name="emergencyContact.contact"
//                   placeholder="Enter emergency contact number"
//                 />
//                 {errors.emergencyContact?.contact && touched.emergencyContact?.contact && (
//                   <div className="text-danger text-sm mt-1">{errors.emergencyContact.contact}</div>
//                 )}
//               </div>
//             </div>
//           </>
//         );
//       case 4:
//         return (
//           <>
//             <h2 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? "text-brand-light" : "text-brand"}`}>
//               <Heart className="mr-2" size={20} />
//               Additional Information
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
//                   Blood Group
//                 </label>
//                 <Field
//                   as="select"
//                   name="bloodGroup"
//                   className={`w-full p-2 rounded-lg border ${
//                     darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
//                   } focus:ring-2 focus:ring-brand focus:border-brand`}
//                 >
//                   <option value="">Select Blood Group</option>
//                   <option value="A+">A+</option>
//                   <option value="A-">A-</option>
//                   <option value="B+">B+</option>
//                   <option value="B-">B-</option>
//                   <option value="AB+">AB+</option>
//                   <option value="AB-">AB-</option>
//                   <option value="O+">O+</option>
//                   <option value="O-">O-</option>
//                 </Field>
//                 {errors.bloodGroup && touched.bloodGroup && (
//                   <div className="text-danger text-sm mt-1">{errors.bloodGroup}</div>
//                 )}
//               </div>
//               <div>
//                 <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
//                   Status
//                 </label>
//                 <Field
//                   as="select"
//                   name="status"
//                   className={`w-full p-2 rounded-lg border ${
//                     darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
//                   } focus:ring-2 focus:ring-brand focus:border-brand`}
//                 >
//                   <option value="Active">Active</option>
//                   <option value="Inactive">Inactive</option>
//                   <option value="On Leave">On Leave</option>
//                 </Field>
//                 {errors.status && touched.status && (
//                   <div className="text-danger text-sm mt-1">{errors.status}</div>
//                 )}
//               </div>
//             </div>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className={darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}>
//       <div className="max-w-3xl mx-auto p-6">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold mb-4">Add New Teacher</h1>
//         </div>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchemas[`step${currentStep}`]}
//           onSubmit={(values, { setSubmitting }) => {
//             console.log('Formik onSubmit triggered, currentStep:', currentStep);
//             if (currentStep === 4) {
//               console.log('Final step submission, showing alert');
//               console.log('Form Values:', values);
//               try {
//                 // Prepare form data
//                 const formData = new FormData();
//                 Object.keys(values).forEach(key => {
//                   if (key === 'avatar') {
//                     if (values[key]) formData.append('avatar', values[key]);
//                   } else if (typeof values[key] === 'object') {
//                     formData.append(key, JSON.stringify(values[key]));
//                   } else {
//                     formData.append(key, values[key]);
//                   }
//                 });
//                 alert('Teacher added successfully!');
//               } catch (error) {
//                 console.error('Error creating employee:', error);
//                 alert('Failed to add teacher. Please try again.');
//               }
//               setSubmitting(false);
//               return;
//             }
//             // For non-final steps, move to next step
//             setCurrentStep(currentStep + 1);
//             setSubmitting(false);
//           }}
//         >
//           {({ errors, touched, isSubmitting }) => (
//             <Form noValidate>
//               <div className={`rounded-xl shadow-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
//                 <div className="p-6">
//                   <Stepper 
//                     activeStep={currentStep}
//                     onStepChange={(step) => {
//                       console.log('Stepper onStepChange called, new step:', step);
//                       if (step <= 4) {
//                         setCurrentStep(step);
//                       }
//                     }}
//                   >
//                     <Stepper.Step
//                       label="Basic Information"
//                       icon={<Users size={16} />}
//                     />
//                     <Stepper.Step
//                       label="Employment Details"
//                       icon={<Briefcase size={16} />}
//                     />
//                     <Stepper.Step
//                       label="Personal Details"
//                       icon={<Calendar size={16} />}
//                     />
//                     <Stepper.Step
//                       label="Additional Information"
//                       icon={<Heart size={16} />}
//                     />
//                   </Stepper>
//                 </div>

//                 <div className="p-6 border-t border-gray-200 dark:border-gray-700">
//                   {renderStepContent(currentStep, errors, touched)}
//                 </div>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }




import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addEducator } from '../../services/employeeServices'; // Adjust the path if needed
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTeacherForm = ({ darkMode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    address: '',
    subjects: '',
    experience: '',
    avatar: null,
  };

  const validationSchemas = {
    step1: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
    }),
    step2: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
      phone: Yup.string().required('Required'),
      dob: Yup.date().required('Required'),
      address: Yup.string().required('Required'),
    }),
    step3: Yup.object({
      subjects: Yup.string().required('Required'),
      experience: Yup.number().min(0, 'Must be at least 0').required('Required'),
    }),
    step4: Yup.object({
      avatar: Yup.mixed().required('Avatar is required'),
    }),
  };

  const renderStepContent = (step, errors, touched, setFieldValue) => {
    switch (step) {
      case 1:
        return (
          <>
            <div>
              <label className={`block mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>First Name</label>
              <Field name="firstName" className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`} />
              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className={`block mt-4 mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Last Name</label>
              <Field name="lastName" className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`} />
              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div>
              <label className={`block mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Email</label>
              <Field name="email" type="email" className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`} />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className={`block mt-4 mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Password</label>
              <Field name="password" type="password" className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`} />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className={`block mt-4 mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Phone</label>
              <Field name="phone" className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`} />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className={`block mt-4 mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Date of Birth</label>
              <Field name="dob" type="date" className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`} />
              <ErrorMessage name="dob" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className={`block mt-4 mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Address</label>
              <Field name="address" as="textarea" className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`} />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div>
              <label className={`block mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Subjects</label>
              <Field name="subjects" className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`} />
              <ErrorMessage name="subjects" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label className={`block mt-4 mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Experience (Years)</label>
              <Field name="experience" type="number" className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`} />
              <ErrorMessage name="experience" component="div" className="text-red-500 text-sm" />
            </div>
          </>
        );
      case 4:
        return (
          <div>
            <label className={`block mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAvatarPreview(URL.createObjectURL(file));
                  setFieldValue('avatar', file);
                }
              }}
              className={`w-full p-2 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-white text-gray-900"} focus:ring-2 focus:ring-brand focus:border-brand`}
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="mt-2 h-20 w-20 object-cover rounded-full border"
              />
            )}
            <ErrorMessage name="avatar" component="div" className="text-red-500 text-sm mt-2" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-8 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg shadow-md`}>
      <h2 className="text-2xl font-bold mb-6">Add Teacher</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchemas[`step${currentStep}`]}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
          } else {
            try {
              setSubmitting(true);

              const formData = new FormData();
              for (const key in values) {
                formData.append(key, values[key]);
              }

              const response = await addEducator(formData);

              toast.success('Educator added successfully!');
              resetForm();
              setCurrentStep(1);
              setAvatarPreview(null);
              console.log('Educator added:', response);
            } catch (error) {
              console.error('Error submitting educator:', error);
              toast.error(error.message || 'Failed to add educator');
            } finally {
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            {renderStepContent(currentStep, errors, touched, setFieldValue)}

            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Previous
                </button>
              )}

              <button
                type="submit"
                className={`px-4 py-2 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded hover:${darkMode ? 'bg-blue-700' : 'bg-blue-600'}`}
                disabled={isSubmitting}
              >
                {currentStep < 4 ? 'Next' : isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTeacherForm;
