// StudentProfileView.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentProfileView = ({ student }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(`/students/${student.basicInfo.StudentId}/edit`)}
          className="px-4 py-2 rounded-md bg-[var(--color-brand)] text-white"
        >
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
            Basic Information
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Student ID:</span>
              <p>{student.basicInfo.StudentId}</p>
            </div>
            <div>
              <span className="font-medium">Name:</span>
              <p>{`${student.basicInfo.firstName} ${student.basicInfo.lastName}`}</p>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <p>{student.basicInfo.studentEmail}</p>
            </div>
            <div>
              <span className="font-medium">Gender:</span>
              <p>{student.basicInfo.gender}</p>
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span>
              <p>{student.basicInfo.dateOfBirth ? new Date(student.basicInfo.dateOfBirth).toLocaleDateString() : 'Not specified'}</p>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <p>{student.enrollmentStatus.status}</p>
            </div>
            <div>
              <span className="font-medium">Approval Status:</span>
              <p>{student.enrollmentStatus.isApproved ? 'Approved' : 'Pending'}</p>
            </div>
          </div>
        </section>

        {/* Program & Educator Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
            Program & Educator Information
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Program:</span>
              <p>{student.programDetails.program}</p>
            </div>
            <div>
              <span className="font-medium">Number of Sessions:</span>
              <p>{student.programDetails.numberOfSessions}</p>
            </div>
            <div>
              <span className="font-medium">Session Type:</span>
              <p>{student.programDetails.sessionType}</p>
            </div>
            <div>
              <span className="font-medium">Timings:</span>
              <p>{student.programDetails.timings}</p>
            </div>
            <div>
              <span className="font-medium">Days of Week:</span>
              <p>{student.programDetails.daysOfWeek.join(', ')}</p>
            </div>
            <div>
              <span className="font-medium">Primary Educator:</span>
              <p>{student.educatorInfo.primary?.name || 'Not assigned'}</p>
            </div>
            <div>
              <span className="font-medium">Secondary Educator:</span>
              <p>{student.educatorInfo.secondary?.name || 'Not assigned'}</p>
            </div>
          </div>
        </section>

        {/* Medical Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
            Medical Information
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Primary Diagnosis:</span>
              <p>{student.medicalInfo.primaryDiagnosis}</p>
            </div>
            <div>
              <span className="font-medium">Comorbidity:</span>
              <p>{student.medicalInfo.comorbidity ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="font-medium">Allergies:</span>
              <p>{student.medicalInfo.allergies.join(', ') || 'None'}</p>
            </div>
            <div>
              <span className="font-medium">Medications:</span>
              <p>{student.medicalInfo.medicalHistory.medications.join(', ') || 'None'}</p>
            </div>
            <div>
              <span className="font-medium">Surgeries:</span>
              <p>{student.medicalInfo.medicalHistory.surgeries.join(', ') || 'None'}</p>
            </div>
            <div>
              <span className="font-medium">Medical Notes:</span>
              <p className="whitespace-pre-line">{student.medicalInfo.medicalHistory.notes || 'None'}</p>
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
              <p>{student.guardianDetails.name}</p>
            </div>
            <div>
              <span className="font-medium">Relation:</span>
              <p>{student.guardianDetails.relation}</p>
            </div>
            <div>
              <span className="font-medium">Contact Number:</span>
              <p>{student.guardianDetails.contactNumber}</p>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <p>{student.guardianDetails.parentEmail}</p>
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
              <p className="whitespace-pre-line">{student.address}</p>
            </div>
            <div>
              <span className="font-medium">Preferred Language:</span>
              <p>{student.preferences.preferredLanguage}</p>
            </div>
            <div>
              <span className="font-medium">Transport Required:</span>
              <p>{student.preferences.transport ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="font-medium">Strengths:</span>
              <p>{student.strengths.join(', ') || 'None'}</p>
            </div>
            <div>
              <span className="font-medium">Weaknesses:</span>
              <p>{student.weaknesses.join(', ') || 'None'}</p>
            </div>
            <div>
              <span className="font-medium">Comments:</span>
              <p className="whitespace-pre-line">{student.comments || 'None'}</p>
            </div>
          </div>
        </section>

        {/* Progress Reports */}
        <section className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-brand)]">
            Progress Reports
          </h2>
          <div className="space-y-4">
            {student.progressReports.length > 0 ? (
              student.progressReports.map((report, index) => (
                <div key={index} className="border border-[var(--color-border-primary)] p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">Date: {new Date(report.date).toLocaleDateString()}</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      By: {report.educator?.name || 'Unknown'}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{report.report}</p>
                </div>
              ))
            ) : (
              <p>No progress reports available</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentProfileView;