// StudentProfileEdit.js
import React from 'react';
import { Save } from 'lucide-react';

const StudentProfileEdit = ({ formData, handleInputChange, handleMultiSelect, handleArrayInputChange, handleSubmit, isSubmitting, submitError, navigate, studentId, educators }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
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
              value={formData.StudentId}
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
            <label className="block mb-1">Avatar</label>
            <div className="flex items-center space-x-4">
              {formData.avatar?.secure_url && (
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    src={formData.avatar.secure_url} 
                    alt="Current Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleInputChange}
                className="flex-1 p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
              />
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Recommended: Square image, max 2MB
            </p>
          </div>
          <div>
            <label className="block mb-1">UDID Document</label>
            <div className="flex items-center space-x-4">
              {formData.UDID?.secure_url && (
                <a 
                  href={formData.UDID.secure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-sm text-[var(--color-brand)] hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>View Current UDID</span>
                </a>
              )}
              <input
                type="file"
                name="UDID"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleInputChange}
                className="flex-1 p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
              />
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Accepted formats: PDF, JPG, PNG (max 5MB)
            </p>
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

      {/* Program Information */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
          Program Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Primary Program</label>
            <select
              name="program"
              value={formData.program}
              onChange={handleInputChange}
              className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
            >
              <option value="">Select Primary Program</option>
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
            <label className="block mb-1">Secondary Program</label>
            <select
              name="program2"
              value={formData.program2}
              onChange={handleInputChange}
              className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
            >
              <option value="">Select Secondary Program</option>
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
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Days of Week</label>
            <select
              multiple
              name="daysOfWeek"
              value={formData.daysOfWeek}
              onChange={handleMultiSelect}
              className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
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
          </div>
        </div>
      </section>

      {/* Educator Information */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
          Educator Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Primary Educator</label>
            <select
              name="primary"
              value={formData.educators?.primary || ''}
              onChange={(e) => handleInputChange(e, 'educators.primary')}
              className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
            >
              <option value="">Select Primary Educator</option>
              {educators
                .filter(educator => educator.program === formData.program)
                .map((educator) => (
                  <option key={educator._id} value={educator._id}>
                    {educator.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Secondary Educator</label>
            <select
              name="secondary"
              value={formData.educators?.secondary || ''}
              onChange={(e) => handleInputChange(e, 'educators.secondary')}
              className="w-full p-2 border border-[var(--color-border-primary)] rounded-md bg-[var(--color-bg-primary)]"
            >
              <option value="">Select Secondary Educator</option>
              {educators
                .filter(educator => educator.program === formData.program2)
                .map((educator) => (
                  <option key={educator._id} value={educator._id}>
                    {educator.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </section>

      {/* Additional sections for Guardian Information, Enrollment Information, Medical Information, and Additional Information go here... */}

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
          className={`px-4 py-2 rounded-md bg-[var(--color-brand)] text-white flex items-center ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
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
  );
};

export default StudentProfileEdit;