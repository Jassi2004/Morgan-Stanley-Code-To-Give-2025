// StudentProfileView.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfileView = ({ student }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(`/students/${student.StudentId}/edit`)}
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
  );
};

export default StudentProfileView;