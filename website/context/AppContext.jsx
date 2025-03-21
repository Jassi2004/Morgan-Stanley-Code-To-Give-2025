import { createContext, useState, useEffect } from "react";
import { getAllStudents } from "../services/studentServices";
import { getAllEmployees } from "../services/employeeServices";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [counts, setCounts] = useState({
        totalStudents: 0,
        activeStudents: 0,
        totalTeachers: 0,
        activeTeachers: 0
    });

    // Theme management
    const prefersDarkMode = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    const savedTheme = localStorage.getItem('theme');
    const initialDarkMode = savedTheme ?
        savedTheme === 'dark' :
        prefersDarkMode;

    const [darkMode, setDarkMode] = useState(initialDarkMode);

    useEffect(() => {
        if (darkMode) { 
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const updateCounts = (studentsData, employeesData) => {
        setCounts({
            totalStudents: studentsData.length,
            activeStudents: studentsData.filter(student => student.status === "Active").length,
            totalTeachers: employeesData.length,
            activeTeachers: employeesData.filter(teacher => teacher.status === "Active").length
        });
    };

    const fetchStudents = async () => {
        try {
            const response = await getAllStudents();
            const studentsData = response.data?.data?.students || [];
            setStudents(studentsData);
            updateCounts(studentsData, employees);
            setError(null);
        } catch (error) {
            console.error("Error fetching students:", error);
            setError("Failed to fetch students");
            setStudents([]);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await getAllEmployees();
            const employeesData = response.data || [];
            setEmployees(employeesData);
            // Update counts with current students and new employees data
            updateCounts(students, employeesData);
            setError(null);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setError("Failed to fetch employees");
            setEmployees([]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch both sets of data first
                const [studentsResponse, employeesResponse] = await Promise.all([
                    getAllStudents(),
                    getAllEmployees()
                ]);

                // Extract the data
                const studentsData = studentsResponse.data?.data?.students || [];
                const employeesData = employeesResponse.data || [];

                // Set both states
                setStudents(studentsData);
                setEmployees(employeesData);

                // Update counts with both sets of data
                updateCounts(studentsData, employeesData);
                
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const refreshStudents = async () => {
        setLoading(true);
        await fetchStudents();
        setLoading(false);
    };

    const refreshEmployees = async () => {
        setLoading(true);
        await fetchEmployees();
        setLoading(false);
    };

    return (
        <AppContext.Provider
            value={{
                darkMode,
                setDarkMode,
                students,
                employees,
                loading,
                error,
                counts,
                refreshStudents,
                refreshEmployees
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
