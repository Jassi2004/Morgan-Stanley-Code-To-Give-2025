import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateStudent, getStudentProfile } from '../../services/studentServices';
import { Upload, X } from 'lucide-react';

const EditStudent = ({ studentId, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    address: '',
    primaryDiagnosis: '',
    comorbidity: false,
    allergies: [],
    transport: false,
    strengths: [],
    weaknesses: [],
    comments: '',
    preferredLanguage: '',
    deviceAccess: [],
    guardianDetails: {
      name: '',
      relation: '',
      contactNumber: '',
      parentEmail: ''
    },
    medicalHistory: {
      medications: [],
      surgeries: [],
      notes: ''
    }
  });

  const [files, setFiles] = useState({
    avatar: null,
    UDID: null
  });

  const [avatarPreview, setAvatarPreview] = useState(studentData?.avatar?.secure_url || '');
  const [UDIDFileName, setUDIDFileName] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await getStudentProfile(studentId);
        if (response.success) {
          // Transform arrays that might come as strings
          const data = response.data;
          
          // Handle arrays that might be strings
          const processArrayField = (field) => {
            if (typeof field === 'string') {
              return field.split(',').map(item => item.trim());
            }
            return Array.isArray(field) ? field : [];
          };

          const transformedData = {
            ...data,
            allergies: processArrayField(data.allergies),
            strengths: processArrayField(data.strengths),
            weaknesses: processArrayField(data.weaknesses),
            deviceAccess: processArrayField(data.deviceAccess),
            medicalHistory: {
              ...data.medicalHistory,
              medications: processArrayField(data.medicalHistory?.medications),
              surgeries: processArrayField(data.medicalHistory?.surgeries)
            }
          };

          setStudentData(transformedData);
          
          // Set avatar preview if exists
          if (data.avatar?.secure_url) {
            setAvatarPreview(data.avatar.secure_url);
          }
          
          // Set UDID filename if exists
          if (data.UDID?.secure_url) {
            const fileName = data.UDID.secure_url.split('/').pop();
            setUDIDFileName(fileName);
          }
        }
      } catch (error) {
        toast.error('Failed to fetch student details');
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setStudentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      setStudentData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'select-multiple') {
      setStudentData(prev => ({
        ...prev,
        [name]: Array.from(e.target.selectedOptions, option => option.value)
      }));
    } else {
      setStudentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayInput = (e, field) => {
    const value = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [type]: file
      }));

      if (type === 'avatar') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (type === 'UDID') {
        setUDIDFileName(file.name);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const hasFiles = files.avatar || files.UDID;
      const response = await updateStudent(studentId, studentData, hasFiles ? files : null);
      
      if (response.success) {
        toast.success('Student details updated successfully');
        onUpdate?.();
        onClose?.();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update student details');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !studentData.firstName) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p>Loading student details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg w-full max-w-3xl m-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[var(--color-text-primary)]">Edit Student Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">First Name</label>
              <input
                type="text"
                name="firstName"
                value={studentData.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={studentData.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Primary Diagnosis</label>
              <select
                name="primaryDiagnosis"
                value={studentData.primaryDiagnosis}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
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
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Preferred Language</label>
              <select
                name="preferredLanguage"
                value={studentData.preferredLanguage}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Sign Language">Sign Language</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Device Access */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Device Access</label>
            <select
              name="deviceAccess"
              multiple
              value={studentData.deviceAccess}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
            >
              <option value="Tablet">Tablet</option>
              <option value="Laptop">Laptop</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Hearing Aid">Hearing Aid</option>
              <option value="Braille Device">Braille Device</option>
            </select>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Hold Ctrl/Cmd to select multiple options</p>
          </div>

          {/* Guardian Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Guardian Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Guardian Name</label>
                <input
                  type="text"
                  name="guardianDetails.name"
                  value={studentData.guardianDetails.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Relation</label>
                <input
                  type="text"
                  name="guardianDetails.relation"
                  value={studentData.guardianDetails.relation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Contact Number</label>
                <input
                  type="tel"
                  name="guardianDetails.contactNumber"
                  value={studentData.guardianDetails.contactNumber}
                  onChange={handleInputChange}
                  pattern="[6-9]\d{9}"
                  className="mt-1 block w-full rounded-md border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
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
                {avatarPreview && (
                  <img src={avatarPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
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
                {UDIDFileName && <span className="text-sm">{UDIDFileName}</span>}
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
              onClick={onClose}
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
    </div>
  );
};

export default EditStudent;