import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Search, Plus, Filter, Eye, Edit, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Teachers = () => {
    const navigate = useNavigate();
  const { teachers } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && teacher.status === "Active";
    if (filter === "inactive") return matchesSearch && teacher.status === "Inactive";
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Teachers</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 py-2 pl-10 pr-4 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
            <Search className="absolute left-3 top-2.5 text-[var(--color-text-accent)]" size={18} />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            >
              <option value="all">All Teachers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button 
          onClick={() => navigate('/teachers/add')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
              <Plus size={18} />
          <Users className="mr-2" size={16} /> 
          Add Teacher
        </button>
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand)] text-white rounded-lg hover:bg-opacity-90">
              <span>Add Teacher</span>
            </button> */}
          </div>
        </div>
      </div>
      
      {/* Teachers Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--color-border-primary)]">
        <table className="min-w-full divide-y divide-[var(--color-border-primary)]">
          <thead className="bg-[var(--color-bg-secondary)]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Employee ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Designation
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-bg-primary)] divide-y divide-[var(--color-border-primary)]">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher, index) => (
                <tr key={teacher.employeeId} className={index % 2 === 0 ? 'bg-[var(--color-bg-primary)]' : 'bg-[var(--color-bg-secondary)]'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                    {teacher.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white">
                          <span className="font-medium">{teacher.name.split(' ')[0].charAt(0)}{teacher.name.split(' ')[1]?.charAt(0) || ''}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">
                          {teacher.name}
                        </div>
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          {teacher.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                    {teacher.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                    <div>
                      <div>{teacher.designation}</div>
                      <div className="text-xs text-[var(--color-text-secondary)]">{teacher.employmentType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      teacher.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                    <div className="flex space-x-2">
                      <button className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-bg-secondary)]">
                        <Eye size={18} />
                      </button>
                      <button className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--color-bg-secondary)]">
                        <Edit size={18} />
                      </button>
                      <button className="p-1 rounded-md text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-[var(--color-bg-secondary)]">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-[var(--color-text-secondary)]">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--color-text-secondary)]">
          Showing <span className="font-medium">{filteredTeachers.length}</span> of <span className="font-medium">{teachers.length}</span> teachers
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
      </div>
    </div>
  );
};

export default Teachers;