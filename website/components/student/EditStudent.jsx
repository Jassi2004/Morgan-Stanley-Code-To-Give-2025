import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateStudent, getStudentProfile } from '../../services/studentServices';
import { Upload, X, ArrowLeft } from 'lucide-react';

const EditStudent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [loading, setLoading] = useState(false);
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
      numberOfSessions: 0,
      sessionType: '',
      daysOfWeek: []
    },
    educatorInfo: {
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

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await getStudentProfile(studentId);
        console.log('Fetched student data:', response.data);
        if (response.success) {
          const data = response.data;
          setStudentData(data);
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

      return { ...prev, [name]: value };
    });
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
      const response = await updateStudent(studentId, studentData, files);
      
      if (response.success) {
        toast.success('Student details updated successfully');
        navigate(`/students/${studentId}`);
      }
    } catch (error) {
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
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Program</label>
              <input
                type="text"
                name="program"
                value={studentData.programDetails.program}
                onChange={(e) => handleInputChange(e, 'programDetails.program')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
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
              <input
                type="text"
                name="primary"
                value={studentData.educatorInfo.primary}
                onChange={(e) => handleInputChange(e, 'educatorInfo.primary')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Secondary Educator</label>
              <input
                type="text"
                name="secondary"
                value={studentData.educatorInfo.secondary}
                onChange={(e) => handleInputChange(e, 'educatorInfo.secondary')}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
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
                {studentData?.basicInfo?.avatar?.secure_url?.toString()?.trim()?.length > 0 && (
                  <img src={studentData?.basicInfo?.avatar?.secure_url?.toString()?.trim()} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
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
                <span className="text-sm">
                  {studentData?.basicInfo?.UDID?.isAvailable ? 
                  <img src={studentData?.basicInfo?.UDID?.secure_url?.toString()?.trim()} alt="Preview" className="w-16 h-16 rounded-full object-cover" /> : "No File Uploaded"}
                </span>
                <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-[var(--color-border-primary)] rounded-md hover:bg-[var(--color-bg-hover)]">
                  <Upload size={20} />
                  <span>Upload</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'UDID')}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                </label>
              </div>
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