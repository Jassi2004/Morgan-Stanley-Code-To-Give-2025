import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes('/edit');
  const { students, fetchData } = useContext(AppContext);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({});

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
          enrollmentYear: foundStudent.enrollmentYear ? new Date(foundStudent.enrollmentYear).getFullYear().toString() : '',
          address: foundStudent.address || '',
          preferredLanguage: foundStudent.preferredLanguage || 'English',
          transport: foundStudent.transport || false,
          guardianDetails: {
            name: foundStudent.guardianDetails?.name || '',
            relation: foundStudent.guardianDetails?.relation || '',
            contactNumber: foundStudent.guardianDetails?.contactNumber || '',
            parentEmail: foundStudent.guardianDetails?.parentEmail || ''
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
    } else {
      // Handle regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would implement the API call to update student data
    console.log('Updating student with data:', formData);
    
    // For now, let's just navigate back to view mode
    navigate(`/students/${studentId}`);
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
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <section className="col-span-2">
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
                </div>
              </section>

              {/* Guardian Information */}
              <section className="col-span-2">
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

              {/* Additional Information */}
              <section className="col-span-2">
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
                    
                    <div className="mt-4">
                      <label className="flex items-center">
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
                </div>
              </section>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate(`/students/${studentId}`)}
                className="px-4 py-2 mr-2 rounded-md border border-[var(--color-border-primary)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[var(--color-brand)] text-white flex items-center"
              >
                <Save size={18} className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          // View Mode UI
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