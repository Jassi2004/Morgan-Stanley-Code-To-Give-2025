import { createContext, useState, useEffect } from "react";
import { Students, Teachers } from "../src/dummyData"; // <-- import dummy data

export const AppContext = createContext();

export function AppProvider({ children }) {
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

    // Students and Teachers state
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);

    // Fetch Students (from dummy data)
    const fetchStudents = () => {
        // Simulate an API delay if you want:
        // setTimeout(() => setStudents(Students), 1000);
        setStudents(Students);
    };

    // Fetch Teachers (from dummy data)
    const fetchTeachers = () => {
        // setTimeout(() => setTeachers(Teachers), 1000);
        setTeachers(Teachers);
    };

    // Fetch data on mount
    useEffect(() => {
        fetchStudents();
        fetchTeachers();
    }, []);

    return (
        <AppContext.Provider
            value={{
                darkMode,
                setDarkMode,
                students,
                teachers,
                fetchStudents,
                fetchTeachers
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
