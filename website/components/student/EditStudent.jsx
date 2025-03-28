import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateStudent, getStudentProfile } from '../../services/studentServices';
import { Upload, X, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const EditStudent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [loading, setLoading] = useState(false);
  const [educators, setEducators] = useState({
    primary: [],
    secondary: []
  });
  const [studentData, setStudentData] = useState({
    basicInfo: {
      firstName: '',
      lastName: '',
      studentEmail: '',
      gender: '',
      dateOfBirth: '',
      contactNumber: '',
      altContactNumber: '',
      avatar: {
        secure_url: '',
        public_id: ''
      },
      UDID: {
        isAvailable: false,
        secure_url: '',
        public_id: ''
      }
    },
    guardianDetails: {
      fathersName: '',
      mothersName: '',
      parentEmail: '',
      contactNumber: ''
    },
    enrollmentStatus: {
      status: '',
      approvalStatus: ''
    },
    programDetails: {
      program: '',
      program2: '',
      numberOfSessions: 0,
      sessionType: '',
      daysOfWeek: []
    },
    educators: {
      primary: '',
      secondary: ''
    },
    medicalInfo: {
      primaryDiagnosis: '',
      comorbidity: false,
      allergies: []
    },
    address: '',
    strengths: [],
    weaknesses: [],
    comments: ''
  });

  const [files, setFiles] = useState({
    avatar: null,
    documents: null
  });

  // Remove the programs useEffect and add hardcoded programs
  const programs = [
    { _id: '1', name: 'Multi' },
    { _id: '2', name: 'Job Readiness' },
    { _id: '3', name: 'Vocation' },
    { _id: '4', name: 'Spruha' },
    { _id: '5', name: 'Suyog' },
    { _id: '6', name: 'Sameti' },
    { _id: '7', name: 'Shaale' },
    { _id: '8', name: 'Siddhi' },
    { _id: '9', name: 'Sattva' }
  ];

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await getStudentProfile(studentId);
        console.log('Fetched student data:', response.data);
        if (response.success) {
          const data = response.data;
          setStudentData({
            basicInfo: {
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              studentEmail: data.studentEmail || '',
              gender: data.gender || '',
              dateOfBirth: data.dateOfBirth || '',
              contactNumber: data.contactNumber || '',
              altContactNumber: data.altContactNumber || '',
              avatar: data.avatar || { secure_url: '', public_id: '' },
              UDID: data.UDID || { isAvailable: false, secure_url: '', public_id: '' }
            },
            guardianDetails: {
              fathersName: data.fathersName || '',
              mothersName: data.mothersName || '',
              parentEmail: data.parentEmail || '',
              contactNumber: data.contactNumber || ''
            },
            enrollmentStatus: {
              status: data.status || 'Active',
              approvalStatus: data.approval?.status || 'pending'
            },
            programDetails: {
              program: data.program || '',
              program2: data.program2 || '',
              numberOfSessions: data.numberOfSessions || 0,
              sessionType: data.sessionType || 'Offline',
              daysOfWeek: data.daysOfWeek || []
            },
            educators: {
              primary: data.educators?.primary?._id || '',
              secondary: data.educators?.secondary?._id || ''
            },
            medicalInfo: {
              primaryDiagnosis: data.primaryDiagnosis || '',
              comorbidity: data.comorbidity || false,
              allergies: data.allergies || []
            },
            address: data.address || '',
            strengths: data.strengths || [],
            weaknesses: data.weaknesses || [],
            comments: data.comments || ''
          });
          // Fetch educators for both primary and secondary programs
          await fetchEducators(data.program, data.program2);
        }
      } catch (error) {
        toast.error('Failed to fetch student details');
        console.error('Error fetching student:', error);
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId, navigate]);

  const fetchEducators = async (primaryProgram, secondaryProgram) => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/employee/fetch-all-employees');
      if (response.data?.data) {
        // Filter educators by program and active status
        const primaryEducators = response.data.data.filter(
          emp => emp.program === primaryProgram && emp.status === 'Active' && emp.employmentType === 'Educator'
        );
        const secondaryEducators = response.data.data.filter(
          emp => emp.program === secondaryProgram && emp.status === 'Active' && emp.employmentType === 'Educator'
        );
        console.log('Fetched educators:', { primaryProgram, secondaryProgram, primaryEducators, secondaryEducators });
        setEducators({
          primary: primaryEducators,
          secondary: secondaryEducators
        });
      }
    } catch (error) {
      console.error('Error fetching educators:', error);
      toast.error('Failed to fetch educators list');
    }
  };

  const handleInputChange = (e, nestedPath = null) => {
    const { name, value, type, checked } = e.target;

    setStudentData(prev => {
      if (nestedPath) {
        const [parent, child] = nestedPath.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        };
      }

      if (type === 'checkbox') {
        return { ...prev, [name]: checked };
      }

      // Handle program changes
      if (name === 'program' && nestedPath === 'programDetails.program') {
        // Clear primary educator when program changes
        const updatedData = {
          ...prev,
          programDetails: {
            ...prev.programDetails,
            program: value
          },
          educators: {
            ...prev.educators,
            primary: '' // Clear primary educator
          }
        };
        // Fetch new educators for the updated program
        fetchEducators(value, prev.programDetails.program2);
        return updatedData;
      }

      if (name === 'program2' && nestedPath === 'programDetails.program2') {
        // Clear secondary educator when program changes
        const updatedData = {
          ...prev,
          programDetails: {
            ...prev.programDetails,
            program2: value
          },
          educators: {
            ...prev.educators,
            secondary: '' // Clear secondary educator
          }
        };
        // Fetch new educators for the updated program
        fetchEducators(prev.programDetails.program, value);
        return updatedData;
      }

      // Handle educator selection
      if (name === 'primary' || name === 'secondary') {
        return {
          ...prev,
          educators: {
            ...prev.educators,
            [name]: value
          }
        };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [field]: file
      }));
      
      // Create a preview URL for images
      if (field === 'avatar') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setStudentData(prev => ({
            ...prev,
            basicInfo: {
              ...prev.basicInfo,
              avatar: {
                ...prev.basicInfo.avatar,
                secure_url: reader.result
              }
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleMultiSelectChange = (e, field) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setStudentData(prev => ({
      ...prev,
      [field]: selectedValues
    }));
  };

  const handleCancel = () => {
    navigate(`/students/${studentId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add studentId
      formDataToSend.append('studentId', studentId);

      // Add all form fields
      Object.entries(studentData).forEach(([key, value]) => {
        if (key === 'basicInfo' || key === 'guardianDetails' || key === 'programDetails' || key === 'medicalInfo') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subKey !== 'avatar' && subKey !== 'UDID') {
              formDataToSend.append(`${key}[${subKey}]`, subValue);
            }
          });
        } else if (key === 'educators') {
          formDataToSend.append('educators[primary]', value.primary);
          formDataToSend.append('educators[secondary]', value.secondary);
        } else if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Add files if they exist
      if (files.avatar) {
        formDataToSend.append('avatar', files.avatar);
      }
      if (files.documents) {
        formDataToSend.append('UDID', files.documents);
      }

      // Log the form data for debugging
      console.log('Form data being sent:', {
        studentId,
        formDataEntries: Array.from(formDataToSend.entries())
      });

      const response = await updateStudent(studentId, formDataToSend);
      
      if (response.success) {
        toast.success('Student details updated successfully');
        navigate(`/students/${studentId}`);
      } else {
        throw new Error(response.message || 'Failed to update student details');
      }
    } catch (error) {
      console.error('Error updating student:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        headers: error.response?.headers
      });
      toast.error(error.message || 'Failed to update student details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p>Loading student details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/students/${studentId}`)}
          className="mr-4 p-2 rounded-md hover:bg-[var(--color-bg-secondary)]"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Edit Student Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md space-y-6">
        {/* Basic Information with Added Fields */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">First Name</label>
              <input
                type="text"
                name="firstName"
                value={studentData.basicInfo.firstName}
                onChange={(e) => handleInputChange(e, 'basicInfo.firstName')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={studentData.basicInfo.lastName}
                onChange={(e) => handleInputChange(e, 'basicInfo.lastName')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
              <input
                type="email"
                name="studentEmail"
                value={studentData.basicInfo.studentEmail}
                onChange={(e) => handleInputChange(e, 'basicInfo.studentEmail')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Gender</label>
              <select
                name="gender"
                value={studentData.basicInfo.gender}
                onChange={(e) => handleInputChange(e, 'basicInfo.gender')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={studentData.basicInfo.dateOfBirth}
                onChange={(e) => handleInputChange(e, 'basicInfo.dateOfBirth')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <br />
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={studentData.basicInfo.contactNumber}
                onChange={(e) => handleInputChange(e, 'basicInfo.contactNumber')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Alternate Contact Number</label>
              <input
                type="tel"
                name="altContactNumber"
                value={studentData.basicInfo.altContactNumber}
                onChange={(e) => handleInputChange(e, 'basicInfo.altContactNumber')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Enrollment Status</label>
              <select
                name="status"
                value={studentData?.enrollmentStatus?.status || "Active"}
                onChange={(e) => handleInputChange(e, 'enrollmentStatus.status')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Approval Status</label>
              <select
                name="approvalStatus"
                value={studentData.enrollmentStatus?.approvalStatus || "pending"}
                onChange={(e) => handleInputChange(e, 'enrollmentStatus.approvalStatus')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </section>

        {/* Program Details Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
            Program Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Primary Program</label>
              <select
                name="program"
                value={studentData.programDetails.program}
                onChange={(e) => handleInputChange(e, 'programDetails.program')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="">Select Primary Program</option>
                {programs.map((program) => (
                  <option key={program._id} value={program.name}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Secondary Program</label>
              <select
                name="program2"
                value={studentData.programDetails.program2}
                onChange={(e) => handleInputChange(e, 'programDetails.program2')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="">Select Secondary Program</option>
                {programs.map((program) => (
                  <option key={program._id} value={program.name}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Number of Sessions</label>
              <input
                type="number"
                name="numberOfSessions"
                value={studentData.programDetails.numberOfSessions}
                onChange={(e) => handleInputChange(e, 'programDetails.numberOfSessions')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Session Type</label>
              <select
                name="sessionType"
                value={studentData.programDetails.sessionType}
                onChange={(e) => handleInputChange(e, 'programDetails.sessionType')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="">Select Session Type</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Days of Week</label>
              <select
                multiple
                name="daysOfWeek"
                value={studentData.programDetails.daysOfWeek}
                onChange={(e) => handleMultiSelectChange(e, 'programDetails.daysOfWeek')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Hold Ctrl/Cmd to select multiple days</p>
            </div>
          </div>
        </section>

        {/* Educator Information */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
            Educator Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Primary Educator</label>
              <select
                name="primary"
                value={studentData.educators.primary || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="">Select Primary Educator</option>
                {educators.primary.map((educator) => (
                  <option key={educator._id} value={educator._id}>
                    {educator.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Secondary Educator</label>
              <select
                name="secondary"
                value={studentData.educators.secondary || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="">Select Secondary Educator</option>
                {educators.secondary.map((educator) => (
                  <option key={educator._id} value={educator._id}>
                    {educator.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Guardian Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
            Guardian Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Father Name</label>
              <input
                type="text"
                name="guardianDetails.name"
                value={studentData.guardianDetails.fathersName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Mother Name</label>
              <input
                type="text"
                name="guardianDetails.relation"
                value={studentData.guardianDetails.mothersName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Parents Email</label>
              <input
                type="email"
                name="guardianDetails.parentEmail"
                value={studentData.guardianDetails.parentEmail}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Profile Picture</label>
            <div className="mt-1 flex items-center space-x-4">
              {studentData?.basicInfo?.avatar?.secure_url && (
                <div className="relative">
                  <img 
                    src={studentData.basicInfo.avatar.secure_url} 
                    alt="Profile Preview" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setStudentData(prev => ({
                        ...prev,
                        basicInfo: {
                          ...prev.basicInfo,
                          avatar: null
                        }
                      }));
                      setFiles(prev => ({ ...prev, avatar: null }));
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-[var(--color-border-primary)] rounded-md hover:bg-[var(--color-bg-hover)]">
                <Upload size={20} />
                <span>Upload</span>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'avatar')}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">UDID Document</label>
            <div className="mt-1 flex items-center space-x-4">
              {studentData?.basicInfo?.UDID?.secure_url && (
                <div className="flex items-center space-x-2">
                  <a 
                    href={studentData.basicInfo.UDID.secure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-brand)] hover:underline flex items-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>View Current UDID</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentData(prev => ({
                        ...prev,
                        basicInfo: {
                          ...prev.basicInfo,
                          UDID: null
                        }
                      }));
                      setFiles(prev => ({ ...prev, documents: null }));
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-[var(--color-border-primary)] rounded-md hover:bg-[var(--color-bg-hover)]">
                <Upload size={20} />
                <span>Upload</span>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, 'documents')}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Accepted formats: PDF, JPG, PNG (max 5MB)
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Address</label>
            <textarea
              name="address"
              value={studentData.address}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Comments</label>
            <textarea
              name="comments"
              value={studentData.comments}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="comorbidity"
              checked={studentData.comorbidity}
              onChange={handleInputChange}
              className="rounded border-[var(--color-border-primary)]"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">Has Comorbidity</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="transport"
              checked={studentData.transport}
              onChange={handleInputChange}
              className="rounded border-[var(--color-border-primary)]"
            />
            <span className="text-sm text-[var(--color-text-secondary)]">Needs Transport</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-[var(--color-border-primary)] rounded-md hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-[var(--color-brand)] text-white rounded-md hover:bg-[var(--color-brand-dark)] ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;