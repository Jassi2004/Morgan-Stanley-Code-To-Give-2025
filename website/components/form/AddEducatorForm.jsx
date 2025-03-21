import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Calendar, User, Mail, Phone, Building2, Briefcase, MapPin, Heart, Clock, UserPlus } from 'lucide-react';

const AddEducatorForm = () => {
  const { darkMode } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    gender: 'MALE',
    email: '',
    password: '',
    designation: 'Educator',
    department: 'Special Education',
    role: 'Employee',
    employmentType: 'Educator',
    program: 'Multi',
    phone: '',
    DOB: '',
    dateOfJoining: '',
    status: 'Active',
    tenure: '0 Years',
    workLocation: 'Foundation',
    emergencyContact: {
      name: '',
      contact: ''
    },
    bloodGroup: 'A+'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/employees/add-educator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add educator');
      }
      
      // Handle success
      alert('Educator added successfully!');
    } catch (error) {
      console.error('Error adding educator:', error);
      alert('Failed to add educator');
    }
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'dark' : ''}`}>
      <div className="max-w-4xl mx-auto bg-[var(--color-bg-primary)] shadow-[var(--shadow-lg)] rounded-lg p-8">
        <div className="flex items-center gap-3 mb-8">
          <UserPlus className="w-8 h-8 text-[var(--color-brand)]" />
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Add New Educator</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Employee ID</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-[var(--color-text-accent)]" />
                </span>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-[var(--color-text-accent)]" />
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                required
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-[var(--color-text-accent)]" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Phone</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Phone className="w-5 h-5 text-[var(--color-text-accent)]" />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Program</label>
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                required
              >
                {['Multi', 'Job Readiness', 'Vocation', 'Spruha', 'Suyog', 'Sameti', 'Shaale', 'Siddhi', 'Sattva'].map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Date of Birth</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Calendar className="w-5 h-5 text-[var(--color-text-accent)]" />
                </span>
                <input
                  type="date"
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Date of Joining</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Calendar className="w-5 h-5 text-[var(--color-text-accent)]" />
                </span>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Work Location</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <MapPin className="w-5 h-5 text-[var(--color-text-accent)]" />
                </span>
                <select
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                >
                  <option value="Foundation">Foundation</option>
                  <option value="Academy">Academy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[var(--color-text-secondary)] mb-2">Blood Group</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Heart className="w-5 h-5 text-[var(--color-text-accent)]" />
                </span>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="border-t border-[var(--color-border-primary)] pt-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[var(--color-text-secondary)] mb-2">Contact Name</label>
                <input
                  type="text"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--color-text-secondary)] mb-2">Contact Number</label>
                <input
                  type="tel"
                  name="emergencyContact.contact"
                  value={formData.emergencyContact.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-[var(--color-border-primary)]">
            <button
              type="button"
              className="px-6 py-2 border border-[var(--color-border-primary)] rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-bg-accent)]"
              onClick={() => setFormData({
                employeeId: '',
                name: '',
                gender: 'MALE',
                email: '',
                password: '',
                designation: 'Educator',
                department: 'Special Education',
                role: 'Employee',
                employmentType: 'Educator',
                program: 'Multi',
                phone: '',
                DOB: '',
                dateOfJoining: '',
                status: 'Active',
                tenure: '0 Years',
                workLocation: 'Foundation',
                emergencyContact: {
                  name: '',
                  contact: ''
                },
                bloodGroup: 'A+'
              })}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white rounded-lg"
            >
              Add Educator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEducatorForm;