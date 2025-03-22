import { useContext, useState } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import EditStudent from "../components/student/EditStudent";
import { toast } from 'react-toastify';

const Students = () => {
  const navigate = useNavigate();
  const { students, loading, error, refreshStudents } = useContext(AppContext);
  // console.log(students);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [diagnosisFilter, setDiagnosisFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Get unique diagnoses from students
  const diagnoses = [...new Set(students.map(student => student.primaryDiagnosis))].filter(Boolean);

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
      programFilter === "all" || (student.programs && student.programs.includes(programFilter));

    return matchesSearch && matchesDiagnosis && matchesProgram;
  });

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
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Students</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 py-2 pl-10 pr-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
            <Search className="absolute left-3 top-2.5 text-[var(--color-text-accent)]" size={18} />
          </div>

          <div className="flex gap-2">
            <select
              value={diagnosisFilter}
              onChange={(e) => setDiagnosisFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
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
              className="px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Student ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Primary Diagnosis
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Programs
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Guardian
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-bg-primary)] divide-y divide-[var(--color-border-primary)]">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <tr key={student._id} className={index % 2 === 0 ? 'bg-[var(--color-bg-primary)]' : 'bg-[var(--color-bg-secondary)]'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                    {student.StudentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white">
                          <span className="font-medium">{student.firstName?.charAt(0)}{student.lastName?.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          {student.studentEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                    {student.primaryDiagnosis}
                    {student.comorbidity && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Comorbidity
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                    {student.programs && student.programs.length > 0
                      ? student.programs.join(", ")
                      : "No programs assigned"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                    <div>
                      <div className="text-sm">{student.guardianDetails?.name}</div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        {student.guardianDetails?.relation}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                    <div className="flex space-x-2">
                      <button
                        className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-bg-secondary)]"
                        onClick={() => navigate(`/students/${student.StudentId}`)}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-bg-secondary)]"
                        onClick={() => navigate(`/students/${student.StudentId}/edit`)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-[var(--color-bg-secondary)]"
                        onClick={() => {/* Handle delete */ }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-[var(--color-text-secondary)]">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--color-text-secondary)]">
          Showing <span className="font-medium">{filteredStudents.length}</span> of <span className="font-medium">{students.length}</span> students
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-md border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">
            Previous
          </button>
          <button className="px-3 py-1 bg-[var(--color-brand)] text-white rounded-md hover:bg-opacity-90">
            1
          </button>
          <button className="px-3 py-1 rounded-md border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]">
            Next
          </button>
        </div>
      </div> */}

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
    </div>
  );
};

export default Students;