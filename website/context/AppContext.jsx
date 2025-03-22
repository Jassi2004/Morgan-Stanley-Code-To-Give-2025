import { createContext, useState, useEffect } from "react";
import { getAllStudents } from "../services/studentServices";
import { getAllEmployees } from "../services/employeeServices";
import { getAllNotifications, publishNotification } from "../services/notificationServices";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [notifications, setNotifications] = useState([]);
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
        // Ensure we have arrays to work with
        const students = Array.isArray(studentsData) ? studentsData : [];
        const employees = Array.isArray(employeesData) ? employeesData : [];

        const activeStudents = students.filter(student => student.status === 'Active').length;
        const activeTeachers = employees.filter(employee => employee.status === 'Active').length;

        setCounts({
            totalStudents: students.length,
            activeStudents,
            totalTeachers: employees.length,
            activeTeachers
        });
    };
 
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [studentsResponse, employeesResponse, notificationsResponse] = await Promise.all([
                getAllStudents(),
                getAllEmployees(),
                getAllNotifications()
            ]);

            // Extract students data from the nested structure
            const studentsData = studentsResponse.data?.students || [];

            // console.log("stu",studentsData);
            
            // Extract employees data
            const employeesData = employeesResponse.data || [];
            // Extract notifications data
            const notificationsData = notificationsResponse.data || [];


            
            setStudents(studentsData);
            setEmployees(employeesData);
            setNotifications(notificationsData);
            updateCounts(studentsData, employeesData);
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Error fetching data:', err);
            // Set empty arrays as fallback
            setStudents([]);
            setEmployees([]);
            setNotifications([]);
            updateCounts([], []);
        } finally {
            setLoading(false);
        }
    };

    const addNotification = async (notificationData) => {
        try {
            await publishNotification(notificationData);
            // Refresh notifications after publishing
            const response = await getAllNotifications();
            setNotifications(response.data || []);
            return { success: true };
        } catch (error) {
            console.error('Error publishing notification:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const contextValue = {
        darkMode,
        setDarkMode,
        students,
        employees,
        notifications,
        loading,
        error,
        counts,
        addNotification,
        fetchData
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};
