import { useContext, useState, useEffect } from "react";
import { Search, Plus, Eye, Edit, Trash2, Calendar, AlertCircle, FileText, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import EditStudent from "../components/student/EditStudent";
import GenerateReport from "./GenerateReport";
import { toast } from 'react-toastify';

const ActionButton = ({ icon: Icon, label, onClick, colorClass = "text-[var(--color-brand)]" }) => (
  <div className="relative group">
    <button
      className={`p-1.5 rounded-md text-[var(--color-text-secondary)] hover:${colorClass} hover:bg-[var(--color-bg-secondary)] transition-all duration-200 transform hover:scale-110`}
      onClick={onClick}
    >
      <Icon size={18} />
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
      {label}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800"></div>
    </div>
  </div>
);

const Students = () => {
  const navigate = useNavigate();
  const { students, loading, error, refreshStudents } = useContext(AppContext);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [diagnosisFilter, setDiagnosisFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  const [isViewReportsModalOpen, setIsViewReportsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  // Get unique diagnoses from students
  const diagnoses = ["Autism", "Down Syndrome", "ADHD", "Cerebral Palsy", "Others"];

  const programs = [
    "Multi",
    "Job Readiness",
    "Vocation",
    "Spruha",
    "Suyog",
    "Sameti",
    "Shaale",
    "Siddhi",
    "Sattva"
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      (student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (student.StudentId?.toLowerCase().includes(searchTerm.toLowerCase()) || '');

    const matchesDiagnosis =
      diagnosisFilter === "all" || student.primaryDiagnosis === diagnosisFilter;

    const matchesProgram =
      programFilter === "all" || student.program === programFilter;

    return matchesSearch && matchesDiagnosis && matchesProgram;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, diagnosisFilter, programFilter]);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleEditComplete = () => {
    refreshStudents();
    setIsEditModalOpen(false);
    setSelectedStudent(null);
    toast.success('Student details updated successfully');
  };

  const handleGenerateReport = (student) => {
    setSelectedStudent(student);
    setIsGenerateReportModalOpen(true);
  };

  const handleViewReports = (student) => {
    navigate(`/reports/${student.StudentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-lg text-[var(--color-text-secondary)]">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <div className="text-lg text-red-500">{error}</div>
        <button
          onClick={refreshStudents}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Students</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 py-2.5 pl-10 pr-4 text-base rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
            <Search className="absolute left-3 top-2.5 text-[var(--color-text-accent)]" size={18} />
          </div>

          <div className="flex gap-2">
            <select
              value={diagnosisFilter}
              onChange={(e) => setDiagnosisFilter(e.target.value)}
              className="px-4 py-2.5 text-base rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            >
              <option value="all">All Diagnoses</option>
              {diagnoses.map((diagnosis) => (
                <option key={diagnosis} value={diagnosis}>
                  {diagnosis}
                </option>
              ))}
            </select>

            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="px-4 py-2.5 text-base rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            >
              <option value="all">All Programs</option>
              {programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>

            <button
              onClick={() => navigate('/students/add')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 text-base rounded-lg flex items-center gap-2"
            >
              <Plus size={18} />
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border-primary)]">
        <table className="min-w-full divide-y divide-[var(--color-border-primary)]">
          <thead className="bg-[var(--color-bg-secondary)]">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Student ID
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Basic Info
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Medical Info
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Program Details
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Contact Info
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-bg-primary)] divide-y divide-[var(--color-border-primary)]">
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr key={student._id} className={index % 2 === 0 ? 'bg-[var(--color-bg-primary)]' : 'bg-[var(--color-bg-secondary)]'}>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-[var(--color-text-primary)]">
                    {student.StudentId}
                    {!student.isApproved && (
                      <span className="ml-2 px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white">
                          <span className="text-lg font-medium">{student.firstName?.charAt(0)}{student.lastName?.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-medium text-[var(--color-text-primary)]">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-base text-[var(--color-text-secondary)]">
                          {student.studentEmail}
                        </div>
                        <div className="text-sm text-[var(--color-text-secondary)] flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(student.dateOfBirth).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-[var(--color-text-primary)]">
                    <div>
                      <div className="font-medium text-base">{student.primaryDiagnosis}</div>
                      {student.comorbidity && (
                        <span className="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Comorbidity
                        </span>
                      )}
                      {student.allergies?.length > 0 && (
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          Allergies: {student.allergies.join(", ")}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-[var(--color-text-primary)]">
                    <div>
                      <div className="font-medium text-base">{student.program || "No program assigned"}</div>
                      <div className="text-sm text-[var(--color-text-secondary)]">
                        Sessions: {student.numberOfSessions || 0}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)]">
                        Type: {student.sessionType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-[var(--color-text-primary)]">
                    <div>
                      <div className="text-base">Father: {student.fathersName}</div>
                      <div className="text-base">Mother: {student.mothersName}</div>
                      <div className="text-sm text-[var(--color-text-secondary)]">
                        Contact: {student.contactNumber}
                      </div>
                      <div className="text-sm text-[var(--color-text-secondary)]">
                        Email: {student.parentEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base text-[var(--color-text-primary)]">
                    <div className="flex items-center space-x-3">
                      <ActionButton
                        icon={Eye}
                        label="View Profile"
                        onClick={() => navigate(`/students/${student.StudentId}`)}
                      />

                      <ActionButton
                        icon={Edit}
                        label="Edit Profile"
                        onClick={() => navigate(`/students/${student.StudentId}/edit`)}
                      />

                      <ActionButton
                        icon={Trash2}
                        label="Delete Student"
                        onClick={() => {/* Handle delete */}}
                        colorClass="text-red-500"
                      />

                      <ActionButton
                        icon={FileText}
                        label="Generate Report"
                        onClick={() => handleGenerateReport(student)}
                      />

                      <ActionButton
                        icon={ClipboardList}
                        label="View Reports"
                        onClick={() => handleViewReports(student)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-base text-[var(--color-text-secondary)]">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg">
          <div className="flex items-center text-sm text-[var(--color-text-secondary)]">
            <span>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? 'text-[var(--color-text-disabled)] bg-[var(--color-bg-disabled)] cursor-not-allowed'
                  : 'text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-brand)] rounded-md">
              {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? 'text-[var(--color-text-disabled)] bg-[var(--color-bg-disabled)] cursor-not-allowed'
                  : 'text-[var(--color-text-primary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedStudent && (
        <EditStudent
          studentId={selectedStudent.StudentId}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedStudent(null);
          }}
          onUpdate={handleEditComplete}
        />
      )}

      {/* Generate Report Modal */}
      {isGenerateReportModalOpen && selectedStudent && (
        <GenerateReport
          isOpen={isGenerateReportModalOpen}
          onClose={() => {
            setIsGenerateReportModalOpen(false);
            setSelectedStudent(null);
          }}
          studentId={selectedStudent.StudentId}
        />
      )}

      {/* View Reports Modal */}
      {isViewReportsModalOpen && selectedStudent && (
        // Implement view reports functionality
        <div>View Reports Modal</div>
      )}
    </div>
  );
};

export default Students;