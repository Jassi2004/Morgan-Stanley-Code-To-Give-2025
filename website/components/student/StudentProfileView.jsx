import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import { getStudentProfile } from "../../services/studentServices";

const StudentProfileView = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [student, setStudent] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    if(!studentId) {
      navigate("/students");
    }
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getStudentProfile(studentId);
        console.log("Data: ", response.data);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student profile:", error);
        setError(error.message || "Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [studentId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/students')}
            className="mr-4 p-2 rounded-md hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Student Profile</h1>
        </div>
        <button
          onClick={() => navigate(`/students/${studentId}/edit`)}
          className="px-6 py-2 text-sm rounded-md bg-[var(--color-brand)] text-white hover:opacity-90 transition-opacity"
        >
          Edit Profile
        </button>
      </div>

      <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="border-b border-[var(--color-border-primary)] p-6">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-[var(--color-bg-secondary)] border-4 border-[var(--color-bg-secondary)] shadow-md">
              {student?.basicInfo?.avatar ? (
                <img 
                  src={student.basicInfo.avatar.secure_url} 
                  alt="Student Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-text-secondary)]">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{`${student?.basicInfo?.firstName} ${student?.basicInfo?.lastName}`}</h2>
              <div className="flex items-center space-x-4 text-sm text-[var(--color-text-secondary)]">
                <span>ID: {studentId}</span>
                <span>•</span>
                <span className="capitalize">{student?.enrollmentStatus?.status}</span>
                <span>•</span>
                <span className="capitalize">{student?.enrollmentStatus?.approvalStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <section className="p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-6 text-[var(--color-brand)] pb-2 border-b border-[var(--color-border-primary)]">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-sm">Email:</span>
                  <p className="text-sm mt-1">{student?.basicInfo?.studentEmail}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Gender:</span>
                  <p className="text-sm mt-1">{student?.basicInfo?.gender}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Date of Birth:</span>
                  <p className="text-sm mt-1">
                    {student?.basicInfo?.dateOfBirth
                      ? new Date(student?.basicInfo?.dateOfBirth).toLocaleDateString()
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-sm">Contact Number:</span>
                  <p className="text-sm mt-1">{student?.basicInfo?.contactNumber || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Alternate Contact:</span>
                  <p className="text-sm mt-1">{student?.basicInfo?.altContactNumber || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">UDID:</span>
                  {student?.basicInfo?.UDID?.isAvailable ? (
                    <div className="mt-1">
                      <a 
                        href={student.basicInfo.UDID.secure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-sm text-[var(--color-brand)] hover:underline"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>View UDID Document</span>
                      </a>
                      <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
                        Document ID: {student.basicInfo.UDID.public_id}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mt-1">Not available</p>
                  )}
                </div>
              </div>
            </section>

            {/* Parent Information */}
            <section className="p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-6 text-[var(--color-brand)] pb-2 border-b border-[var(--color-border-primary)]">
                Parent Information
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-sm">Father's Name:</span>
                  <p className="text-sm mt-1">{student?.guardianDetails?.fathersName || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Mother's Name:</span>
                  <p className="text-sm mt-1">{student?.guardianDetails?.mothersName || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Parent Email:</span>
                  <p className="text-sm mt-1">{student?.guardianDetails?.parentEmail || 'Not specified'}</p>
                </div>
              </div>
            </section>

            {/* Program & Educator Information */}
            <section className="p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-6 text-[var(--color-brand)] pb-2 border-b border-[var(--color-border-primary)]">
                Program & Educator Information
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-sm">Primary Program:</span>
                  <p className="text-sm mt-1">{student?.programDetails?.program || 'Not assigned'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Secondary Program:</span>
                  <p className="text-sm mt-1">{student?.programDetails?.program2 || 'Not assigned'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Number of Sessions:</span>
                  <p className="text-sm mt-1">{student?.programDetails?.numberOfSessions || 0}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Session Type:</span>
                  <p className="text-sm mt-1">{student?.programDetails?.sessionType || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Days of Week:</span>
                  <p className="text-sm mt-1">{student?.programDetails?.daysOfWeek?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Primary Educator:</span>
                  <p className="text-sm mt-1">{student?.educatorInfo?.primary?.name || 'Not assigned'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Secondary Educator:</span>
                  <p className="text-sm mt-1">{student?.educatorInfo?.secondary?.name || 'Not assigned'}</p>
                </div>
              </div>
            </section>

            {/* Medical Information */}
            <section className="p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-6 text-[var(--color-brand)] pb-2 border-b border-[var(--color-border-primary)]">
                Medical Information
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-sm">Primary Diagnosis:</span>
                  <p className="text-sm mt-1">{student?.medicalInfo?.primaryDiagnosis}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Comorbidity:</span>
                  <p className="text-sm mt-1">{student?.comorbidity ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Allergies:</span>
                  <p className="text-sm mt-1">{student?.allergies?.length > 0 ? student.allergies.join(', ') : 'None'}</p>
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section className="p-6 rounded-lg md:col-span-2">
              <h2 className="text-lg font-semibold mb-6 text-[var(--color-brand)] pb-2 border-b border-[var(--color-border-primary)]">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="font-medium text-sm">Address:</span>
                  <p className="text-sm mt-1 whitespace-pre-line">{student?.address || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Strengths:</span>
                  <p className="text-sm mt-1">{student?.strengths?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Weaknesses:</span>
                  <p className="text-sm mt-1">{student?.weaknesses?.join(', ') || 'None'}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Comments:</span>
                  <p className="text-sm mt-1 whitespace-pre-line">{student?.comments || 'None'}</p>
                </div>
              </div>
            </section>

            {/* Progress Reports */}
            <section className="p-6 rounded-lg md:col-span-2">
              <h2 className="text-lg font-semibold mb-6 text-[var(--color-brand)] pb-2 border-b border-[var(--color-border-primary)]">
                Progress Reports
              </h2>
              <div className="space-y-4">
                {student?.progressReports?.length > 0 ? (
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
                  <p className="text-sm text-[var(--color-text-secondary)]">No progress reports available</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;