import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { updateStudent } from '../../services/studentServices';

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');
  const { students, fetchData, employees } = useContext(AppContext);



  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (students.length > 0) {
      const foundStudent = students.find(s => s.StudentId === studentId);
      if (foundStudent) {
        setStudent(foundStudent);
        setFormData({
          firstName: foundStudent.firstName || '',
          lastName: foundStudent.lastName || '',
          studentEmail: foundStudent.studentEmail || '',
          gender: foundStudent.gender || '',
          dateOfBirth: foundStudent.dateOfBirth ? new Date(foundStudent.dateOfBirth).toISOString().split('T')[0] : '',
          primaryDiagnosis: foundStudent.primaryDiagnosis || '',
          comorbidity: foundStudent.comorbidity || false,
          enrollmentYear: foundStudent.enrollmentYear ? new Date(foundStudent.enrollmentYear).toISOString().split('T')[0] : '',
          address: foundStudent.address || '',
          preferredLanguage: foundStudent.preferredLanguage || 'English',
          transport: foundStudent.transport || false,
          timings: foundStudent.timings || '',
          numberOfSessions: foundStudent.numberOfSessions || 0,
          sessionType: foundStudent.sessionType || 'Offline',
          daysOfWeek: foundStudent.daysOfWeek || ['All'],
          status: foundStudent.status || 'Active',
          allergies: foundStudent.allergies || [],
          strengths: foundStudent.strengths || [],
          weaknesses: foundStudent.weaknesses || [],
          comments: foundStudent.comments || '',
          deviceAccess: foundStudent.deviceAccess || [],
          guardianDetails: {
            name: foundStudent.guardianDetails?.name || '',
            relation: foundStudent.guardianDetails?.relation || '',
            contactNumber: foundStudent.guardianDetails?.contactNumber || '',
            parentEmail: foundStudent.guardianDetails?.parentEmail || ''
          },
          medicalHistory: {
            medications: foundStudent.medicalHistory?.medications || [],
            surgeries: foundStudent.medicalHistory?.surgeries || [],
            notes: foundStudent.medicalHistory?.notes || ''
          }
        });
        setLoading(false);
      } else {
        setError('Student not found');
        setLoading(false);
      }
    }
  }, [studentId, students]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      // Handle nested objects (like guardianDetails.name)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (type === 'checkbox' && !name.includes('.')) {
      // Handle checkbox inputs
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // Handle regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayInputChange = (e, field) => {
    const value = e.target.value;
    const array = value ? value.split(',').map(item => item.trim()) : [];

    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setFormData(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Show loading state
      setLoading(true);
      setIsSubmitting(true);

      // Format dates properly
      const formattedData = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        enrollmentYear: new Date(formData.enrollmentYear).toISOString(),
      };

      // Get file inputs if they exist
      const avatarInput = document.querySelector('input[name="avatar"]');
      const udidInput = document.querySelector('input[name="UDID"]');

      const files = {
        avatar: avatarInput?.files[0],
        UDID: udidInput?.files[0]
      };

      // Only include files if they exist
      const hasFiles = files.avatar || files.UDID;

      // Call the update service
      const response = await updateStudent(
        studentId,
        formattedData,
        hasFiles ? files : null
      );

      if (response.success) {
        // Update local state
        setStudent(response.data);
        // Refresh the students list in context
        await fetchData();
        // Navigate back to view mode
        navigate(`/students/${studentId}`);
        // Show success message (you can implement your own toast/notification system)
        alert('Profile updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      setSubmitError(error.message || 'Failed to update profile');
      // Show error message to user
      alert(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };


  const ProgramSelect = ({ value, onChange }) => {
    const { darkMode } = useContext(AppContext);

    return (
      <div>
        <select
          name="program"
          id='program'
          value={value}
          onChange={handleInputChange}
          className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
        >
          <option value="">Select Program</option>
          <option value="Multi">Multi</option>
          <option value="Job Readiness">Job Readiness</option>
          <option value="Vocation">Vocation</option>
          <option value="Spruha">Spruha</option>
          <option value="Suyog">Suyog</option>
          <option value="Sameti">Sameti</option>
          <option value="Shaale">Shaale</option>
          <option value="Siddhi">Siddhi</option>
          <option value="Sattva">Sattva</option>
        </select>
      </div>
    );
  };

  const EducatorSelect = ({ name, label, educators, value, onChange }) => {
    const { darkMode } = useContext(AppContext);

    return (

      <div>
        <select
          name={name}
          id={name}
          value={value}
          onChange={handleInputChange}
          className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
        >
         <option value="">Select {label}</option>
          {educators.map((educator) => (
            <option key={educator.id} value={educator.id}>
              {educator.name}
            </option>
          ))}
        </select>
      </div>
      
    );
  };

  if (loading) return <div className="p-8 text-center">Loading student data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!student) return <div className="p-8 text-center">Student not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/students')}
          className="mr-4 p-2 rounded-md hover:bg-[var(--color-bg-secondary)]"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Student Profile' : 'Student Profile'}
        </h1>
      </div>

      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
        {isEditMode ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}

            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
                Program & Educator Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Program</label>
                  <ProgramSelect
                    value={formData.program}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1">Primary Educator</label>
                  <EducatorSelect
                    name="primaryEducator"
                    label="Primary Educator"
                    educators={employees}
                    value={formData.primaryEducator}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1">Secondary Educator</label>
                  <EducatorSelect
                    name="secondaryEducator"
                    label="Secondary Educator"
                    educators={employees}
                    value={formData.secondaryEducator}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Student ID</label>
                  <input
                    type="text"
                    name="StudentId"
                    value={student.StudentId}
                    disabled
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)] opacity-70"
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Primary Diagnosis</label>
                  <select
                    name="primaryDiagnosis"
                    value={formData.primaryDiagnosis}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  >
                    <option value="">Select Diagnosis</option>
                    <option value="Autism">Autism</option>
                    <option value="Down Syndrome">Down Syndrome</option>
                    <option value="ADHD">ADHD</option>
                    <option value="Cerebral Palsy">Cerebral Palsy</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      name="comorbidity"
                      checked={formData.comorbidity}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Comorbidity Present</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Guardian Information */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
                Guardian Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Guardian Name</label>
                  <input
                    type="text"
                    name="guardianDetails.name"
                    value={formData.guardianDetails.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Relation</label>
                  <input
                    type="text"
                    name="guardianDetails.relation"
                    value={formData.guardianDetails.relation}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Contact Number</label>
                  <input
                    type="tel"
                    name="guardianDetails.contactNumber"
                    value={formData.guardianDetails.contactNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    name="guardianDetails.parentEmail"
                    value={formData.guardianDetails.parentEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
              </div>
            </section>

            {/* Enrollment Information */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
                Enrollment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Enrollment Year</label>
                  <input
                    type="date"
                    name="enrollmentYear"
                    value={formData.enrollmentYear}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  >
                    <option value="Active">Active</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Number of Sessions</label>
                  <input
                    type="number"
                    name="numberOfSessions"
                    value={formData.numberOfSessions}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Session Type</label>
                  <select
                    name="sessionType"
                    value={formData.sessionType}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Timings (HH:MM - HH:MM)</label>
                  <input
                    type="text"
                    name="timings"
                    value={formData.timings}
                    onChange={handleInputChange}
                    placeholder="09:00 - 11:00"
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Days of Week</label>
                  <select
                    name="daysOfWeek"
                    multiple
                    value={formData.daysOfWeek}
                    onChange={handleMultiSelect}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)] h-32"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                    <option value="All">All</option>
                  </select>
                  <small className="text-gray-500">Hold Ctrl/Cmd to select multiple</small>
                </div>
              </div>
            </section>

            {/* Medical Information */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
                Medical Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Allergies (comma separated)</label>
                  <input
                    type="text"
                    value={formData.allergies.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'allergies')}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Medications (comma separated)</label>
                  <input
                    type="text"
                    value={formData.medicalHistory.medications.join(', ')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const array = value ? value.split(',').map(item => item.trim()) : [];
                      setFormData(prev => ({
                        ...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          medications: array
                        }
                      }));
                    }}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Surgeries (comma separated)</label>
                  <input
                    type="text"
                    value={formData.medicalHistory.surgeries.join(', ')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const array = value ? value.split(',').map(item => item.trim()) : [];
                      setFormData(prev => ({
                        ...prev,
                        medicalHistory: {
                          ...prev.medicalHistory,
                          surgeries: array
                        }
                      }));
                    }}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Medical Notes</label>
                  <textarea
                    name="medicalHistory.notes"
                    value={formData.medicalHistory.notes}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-1">Comments</label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label className="block mb-1">Strengths (comma separated)</label>
                  <input
                    type="text"
                    value={formData.strengths.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'strengths')}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Weaknesses (comma separated)</label>
                  <input
                    type="text"
                    value={formData.weaknesses.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'weaknesses')}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Preferred Language</label>
                  <select
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Sign Language">Sign Language</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Device Access</label>
                  <select
                    name="deviceAccess"
                    multiple
                    value={formData.deviceAccess}
                    onChange={handleMultiSelect}
                    className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)] h-32"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Hearing Aid">Hearing Aid</option>
                    <option value="Braille Device">Braille Device</option>
                  </select>
                  <small className="text-gray-500">Hold Ctrl/Cmd to select multiple</small>
                </div>
                <div>
                  <label className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      name="transport"
                      checked={formData.transport}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span>Transport Required</span>
                  </label>
                </div>
              </div>
            </section>

            <div className="mt-8 flex justify-end">
              {submitError && (
                <div className="mr-auto text-red-500">
                  {submitError}
                </div>
              )}
              <button
                type="button"
                onClick={() => navigate(`/students/${studentId}`)}
                className="px-4 py-2 mr-2 rounded-md border border-[var(--color-border-primary)]"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md bg-[var(--color-brand)] text-white flex items-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⌛</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          // View Mode UI - your existing view mode code
          // ...
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => navigate(`/students/${studentId}/edit`)}
                className="px-4 py-2 rounded-md bg-[var(--color-brand)] text-white"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
                  Personal Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Student ID:</span>
                    <p>{student.StudentId}</p>
                  </div>
                  <div>
                    <span className="font-medium">Name:</span>
                    <p>{`${student.firstName} ${student.lastName}`}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{student.studentEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span>
                    <p>{student.gender}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth:</span>
                    <p>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Primary Diagnosis:</span>
                    <p>{student.primaryDiagnosis || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Enrollment Year:</span>
                    <p>{student.enrollmentYear ? new Date(student.enrollmentYear).getFullYear() : 'Not specified'}</p>
                  </div>
                </div>
              </section>

              {/* Guardian Information */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
                  Guardian Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Guardian Name:</span>
                    <p>{student.guardianDetails?.name || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Relation:</span>
                    <p>{student.guardianDetails?.relation || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Contact Number:</span>
                    <p>{student.guardianDetails?.contactNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{student.guardianDetails?.parentEmail || 'Not specified'}</p>
                  </div>
                </div>
              </section>

              {/* Additional Information */}
              <section className="md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
                  Additional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="whitespace-pre-line">{student.address || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Preferred Language:</span>
                    <p>{student.preferredLanguage || 'English'}</p>

                    <div className="mt-3">
                      <span className="font-medium">Transport Required:</span>
                      <p>{student.transport ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;