import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { updateStudent, getStudentProfile, getAllStudents } from '../../services/studentServices';

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');
  const { students, fetchData, employees } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentEmail: '',
    gender: '',
    dateOfBirth: '',
    primaryDiagnosis: '',
    comorbidity: false,
    address: '',
    fathersName: '',
    mothersName: '',
    parentEmail: '',
    contactNumber: '',
    program: '',
    numberOfSessions: 0,
    sessionType: 'Offline',
    daysOfWeek: ['All'],
    status: 'Active',
    allergies: [],
    strengths: [],
    weaknesses: [],
    comments: '',
    avatar: null,
    UDID: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getStudentProfile(studentId);
        if (response.success) {
          setStudent(response.data);
          
          setFormData({
            firstName: studentData.firstName || '',
            lastName: studentData.lastName || '',
            studentEmail: studentData.studentEmail || '',
            gender: studentData.gender || '',
            dateOfBirth: studentData.dateOfBirth ? new Date(studentData.dateOfBirth).toISOString().split('T')[0] : '',
            primaryDiagnosis: studentData.primaryDiagnosis || '',
            comorbidity: Boolean(studentData.comorbidity),
            address: studentData.address || '',
            fathersName: studentData.fathersName || '',
            mothersName: studentData.mothersName || '',
            parentEmail: studentData.parentEmail || '',
            contactNumber: studentData.contactNumber || '',
            program: studentData.program || '',
            numberOfSessions: Number(studentData.numberOfSessions) || 0,
            sessionType: studentData.sessionType || 'Offline',
            daysOfWeek: Array.isArray(studentData.daysOfWeek) ? studentData.daysOfWeek : ['All'],
            status: studentData.status || 'Active',
            allergies: Array.isArray(studentData.allergies) ? studentData.allergies : [],
            strengths: Array.isArray(studentData.strengths) ? studentData.strengths : [],
            weaknesses: Array.isArray(studentData.weaknesses) ? studentData.weaknesses : [],
            comments: studentData.comments || '',
            avatar: null,
            UDID: null
          });
        } else {
          throw new Error(response.message || 'Failed to fetch student data');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError(error.message || 'Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'contactNumber') {
      // Ensure contactNumber is treated as a number
      const numberValue = value === '' ? '' : Number(value);
      setFormData(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
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

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Create FormData object for file uploads
      const formDataToSend = new FormData();

      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'avatar' && key !== 'UDID') {
          if (Array.isArray(formData[key])) {
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Append files if they exist
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }
      if (formData.UDID) {
        formDataToSend.append('UDID', formData.UDID);
      }

      const response = await updateStudent(studentId, formDataToSend);

      if (response.success) {
        setStudent(response.data);
        await fetchData();
        navigate(`/students/${studentId}`, { replace: true });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSubmitError(error.message || 'Failed to update profile');
    } finally {
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
          onChange={onChange}
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
          onChange={onChange}
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!student) {
    return <div>No student data found</div>;
  }

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
            {/* Program Information */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                Program Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Program</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
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

                <div>
                  <label className="block mb-1 text-sm">Number of Sessions</label>
                  <input
                    type="number"
                    name="numberOfSessions"
                    value={formData.numberOfSessions}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Session Type</label>
                  <select
                    name="sessionType"
                    value={formData.sessionType}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm">Days of Week</label>
                  <input
                    type="text"
                    name="daysOfWeek"
                    value={formData.daysOfWeek.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'daysOfWeek')}
                    placeholder="e.g. Monday, Wednesday, Friday"
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-4">
                  <label className="block mb-1 text-sm font-medium">Profile Picture</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-[var(--color-border-primary)] flex items-center justify-center overflow-hidden bg-[var(--color-bg-secondary)]">
                        {student?.avatar?.secure_url ? (
                          <img 
                            src={student.avatar.secure_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-[var(--color-text-secondary)] text-sm text-center p-2">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)] hover:bg-[var(--color-bg-hover)]">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-2 text-[var(--color-text-secondary)]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p className="text-sm text-[var(--color-text-secondary)]">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-[var(--color-text-secondary)]">PNG, JPG (MAX. 800x400px)</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'avatar')}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {formData.avatar && (
                          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                            Selected: {formData.avatar.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="block mb-1 text-sm font-medium">UDID Document</label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-[var(--color-border-primary)] flex items-center justify-center bg-[var(--color-bg-secondary)]">
                        {student?.UDID?.secure_url ? (
                          <a 
                            href={student.UDID.secure_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center w-full h-full"
                          >
                            <svg className="w-8 h-8 text-[var(--color-brand)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-xs text-[var(--color-brand)] mt-1">View UDID</span>
                          </a>
                        ) : (
                          <div className="text-[var(--color-text-secondary)] text-sm text-center p-2">
                            No File
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)] hover:bg-[var(--color-bg-hover)]">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-2 text-[var(--color-text-secondary)]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                              </svg>
                              <p className="text-sm text-[var(--color-text-secondary)]">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-[var(--color-text-secondary)]">PDF, PNG, JPG (MAX. 10MB)</p>
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'UDID')}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {formData.UDID && (
                          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                            Selected: {formData.UDID.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Email</label>
                  <input
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Medical Information */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                Medical Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Primary Diagnosis</label>
                  <select
                    name="primaryDiagnosis"
                    value={formData.primaryDiagnosis}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  >
                    <option value="">Select Diagnosis</option>
                    <option value="ADHD">ADHD</option>
                    <option value="Autism">Autism</option>
                    <option value="Down Syndrome">Down Syndrome</option>
                    <option value="Cerebral Palsy">Cerebral Palsy</option>
                    <option value="Learning Disability">Learning Disability</option>
                    <option value="Intellectual Disability">Intellectual Disability</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="comorbidity"
                    checked={formData.comorbidity}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm">Comorbidity Present</label>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm">Allergies</label>
                  <input
                    type="text"
                    value={formData.allergies.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'allergies')}
                    placeholder="Enter allergies separated by commas"
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
              </div>
            </section>

            {/* Parent Information */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                Parent Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Father's Name</label>
                  <input
                    type="text"
                    name="fathersName"
                    value={formData.fathersName}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Mother's Name</label>
                  <input
                    type="text"
                    name="mothersName"
                    value={formData.mothersName}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Parent Email</label>
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                Additional Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  ></textarea>
                </div>

                <div>
                  <label className="block mb-1 text-sm">Strengths</label>
                  <input
                    type="text"
                    value={formData.strengths.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'strengths')}
                    placeholder="Enter strengths separated by commas"
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Weaknesses</label>
                  <input
                    type="text"
                    value={formData.weaknesses.join(', ')}
                    onChange={(e) => handleArrayInputChange(e, 'weaknesses')}
                    placeholder="Enter weaknesses separated by commas"
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Comments</label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 text-sm border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
                  ></textarea>
                </div>
              </div>
            </section>

            {submitError && (
              <div className="text-red-500 text-sm mb-4">{submitError}</div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(`/students/${studentId}`)}
                className="px-4 py-2 text-sm border border-[var(--color-border-primary)] rounded-md hover:bg-[var(--color-bg-secondary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-[var(--color-brand)] text-white rounded-md hover:bg-[var(--color-brand-dark)] flex items-center gap-2"
              >
                <Save size={16} />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => navigate(`/students/${studentId}/edit`)}
                className="px-4 py-2 text-sm rounded-md bg-[var(--color-brand)] text-white"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <section>
                <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                  Basic Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Student ID:</span>
                    <p className="text-sm">{student?.StudentId}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Name:</span>
                    <p className="text-sm">{student?.firstName} {student?.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Email:</span>
                    <p className="text-sm">{student?.studentEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Gender:</span>
                    <p className="text-sm">{student?.gender}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Date of Birth:</span>
                    <p className="text-sm">{student?.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Status:</span>
                    <p className="text-sm">{student?.status}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Approval Status:</span>
                    <p className="text-sm capitalize">{student?.approval?.status || 'Pending'}</p>
                  </div>
                </div>
              </section>

              {/* Parent Information */}
              <section>
                <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                  Parent Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Father's Name:</span>
                    <p className="text-sm">{student?.fathersName || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Mother's Name:</span>
                    <p className="text-sm">{student?.mothersName || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Parent Email:</span>
                    <p className="text-sm">{student?.parentEmail || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Contact Number:</span>
                    <p className="text-sm">{student?.contactNumber || 'Not specified'}</p>
                  </div>
                </div>
              </section>

              {/* Program & Educator Information */}
              <section>
                <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                  Program & Educator Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Program:</span>
                    <p className="text-sm">{student?.program || 'Not assigned'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Number of Sessions:</span>
                    <p className="text-sm">{student?.numberOfSessions || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Session Type:</span>
                    <p className="text-sm">{student?.sessionType || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Days of Week:</span>
                    <p className="text-sm">{student?.daysOfWeek?.join(', ') || 'All'}</p>
                  </div>
                </div>
              </section>

              {/* Medical Information */}
              <section>
                <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                  Medical Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Primary Diagnosis:</span>
                    <p className="text-sm">{student?.primaryDiagnosis}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Comorbidity:</span>
                    <p className="text-sm">{student?.comorbidity ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Allergies:</span>
                    <p className="text-sm">{student?.allergies?.length > 0 ? student.allergies.join(', ') : 'None'}</p>
                  </div>
                </div>
              </section>

              {/* Additional Information */}
              <section className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                  Additional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-sm">Address:</span>
                    <p className="text-sm whitespace-pre-line">{student.address}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Strengths:</span>
                    <p className="text-sm">{student.strengths.join(', ') || 'None'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Weaknesses:</span>
                    <p className="text-sm">{student.weaknesses.join(', ') || 'None'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Comments:</span>
                    <p className="text-sm whitespace-pre-line">{student.comments || 'None'}</p>
                  </div>
                </div>
              </section>

              {/* Progress Reports */}
              <section className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
                  Progress Reports
                </h2>
                <div className="space-y-4">
                  {student.progressReports.length > 0 ? (
                    student.progressReports.map((report, index) => (
                      <div key={index} className="border border-[var(--color-border-primary)] p-4 rounded-md">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">Date: {new Date(report.date).toLocaleDateString()}</span>
                          <span className="text-sm text-[var(--color-text-secondary)]">
                            By: {report.educator?.name || 'Unknown'}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-line">{report.report}</p>
                      </div>
                    ))
                  ) : (
                    <p>No progress reports available</p>
                  )}
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