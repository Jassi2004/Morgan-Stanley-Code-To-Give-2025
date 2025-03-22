// StudentProfileEdit.js
import React from 'react';
import { Save } from 'lucide-react';

const StudentProfileEdit = ({ formData, handleInputChange, handleMultiSelect, handleArrayInputChange, handleSubmit, isSubmitting, submitError, navigate, studentId }) => {
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