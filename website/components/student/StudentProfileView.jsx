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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/students')}
          className="mr-4 p-2 rounded-md hover:bg-[var(--color-bg-secondary)]"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Student Profile</h1>
      </div>

      <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-md">
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
                <p className="text-sm">{studentId}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Name:</span>
                <p className="text-sm">{`${student?.basicInfo?.firstName} ${student?.basicInfo?.lastName}`}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Email:</span>
                <p className="text-sm">{student?.basicInfo?.studentEmail}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Gender:</span>
                <p className="text-sm">{student?.basicInfo?.gender}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Date of Birth:</span>
                <p className="text-sm">
                  {student?.basicInfo?.dateOfBirth
                    ? new Date(student?.basicInfo?.dateOfBirth).toLocaleDateString()
                    : 'Not specified'}
                </p>
              </div>
              <div>
                <span className="font-medium text-sm">Status:</span>
                <p className="text-sm">{student?.enrollmentStatus?.status}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Approval Status:</span>
                <p className="text-sm capitalize">{student?.enrollmentStatus?.approvalStatus}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Contact Number:</span>
                <p className="text-sm">{student?.basicInfo?.contactNumber || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Alternate Contact Number:</span>
                <p className="text-sm">{student?.basicInfo?.altContactNumber || 'Not specified'}</p>
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
                <p className="text-sm">{student?.guardianDetails?.fathersName || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Mother's Name:</span>
                <p className="text-sm">{student?.guardianDetails?.mothersName || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Parent Email:</span>
                <p className="text-sm">{student?.guardianDetails?.parentEmail || 'Not specified'}</p>
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
                <p className="text-sm">{student?.programDetails?.program || 'Not assigned'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Number of Sessions:</span>
                <p className="text-sm">{student?.programDetails?.numberOfSessions || 0}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Session Type:</span>
                <p className="text-sm">{student?.programDetails?.sessionType || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Days of Week:</span>
                <p className="text-sm">{student?.programDetails?.daysOfWeek?.join(', ') || 'All'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Primary Educator:</span>
                <p className="text-sm">{student?.educatorInfo?.primary?.name || 'Not assigned'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Secondary Educator:</span>
                <p className="text-sm">{student?.educatorInfo?.secondary?.name || 'Not assigned'}</p>
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
                <p className="text-sm">{student?.medicalInfo?.primaryDiagnosis}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Comorbidity:</span>
                <p className="text-sm">{student?.medicalInfo?.comorbidity ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Allergies:</span>
                <p className="text-sm">{student?.medicalInfo?.allergies?.length > 0 ? student.medicalInfo.allergies.join(', ') : 'None'}</p>
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
                <p className="text-sm whitespace-pre-line">{student?.address || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Strengths:</span>
                <p className="text-sm">{student?.strengths?.join(', ') || 'None'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Weaknesses:</span>
                <p className="text-sm">{student?.weaknesses?.join(', ') || 'None'}</p>
              </div>
              <div>
                <span className="font-medium text-sm">Comments:</span>
                <p className="text-sm whitespace-pre-line">{student?.comments || 'None'}</p>
              </div>
            </div>
          </section>

          {/* Progress Reports */}
          <section className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-[var(--color-brand)]">
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
                <p>No progress reports available</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileView;