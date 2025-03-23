import React, { createContext, useState, useEffect } from "react";
import { getAllStudents } from "../services/studentServices";
import { getAllEmployees } from "../services/employeeServices";
import { getAllNotifications, publishNotification } from "../services/notificationServices";
import { getEntityDetails, rejectRegistration } from "../services/adminNotificationServices";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [entityDetails, setEntityDetails] = useState(null); // New: Store fetched entity details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [counts, setCounts] = useState({
        totalStudents: 0,
        activeStudents: 0,
        totalTeachers: 0,
        activeTeachers: 0,
    });

    // Theme management
    const prefersDarkMode =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    const initialDarkMode = savedTheme ? savedTheme === "dark" : prefersDarkMode;
    const [darkMode, setDarkMode] = useState(initialDarkMode);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const updateCounts = (studentsData, employeesData) => {
        const students = Array.isArray(studentsData) ? studentsData : [];
        const employees = Array.isArray(employeesData) ? employeesData : [];
        const activeStudents = students.filter((student) => student.status === "Active").length;
        const activeTeachers = employees.filter((employee) => employee.status === "Active").length;

        setCounts({
            totalStudents: students.length,
            activeStudents,
            totalTeachers: employees.length,
            activeTeachers,
        });
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [studentsResponse, employeesResponse, notificationsResponse] = await Promise.all([
                getAllStudents(),
                getAllEmployees(),
                getAllNotifications(),
            ]);

            const studentsData = studentsResponse.data?.students || [];
            const employeesData = employeesResponse.data || [];
            const notificationsData = notificationsResponse.data || [];

            setStudents(studentsData);
            setEmployees(employeesData);
            setNotifications(notificationsData);
            updateCounts(studentsData, employeesData);
        } catch (err) {
            setError("Failed to fetch data");
            console.error("Error fetching data:", err);
            setStudents([]);
            setEmployees([]);
            setNotifications([]);
            updateCounts([], []);
        } finally {
            setLoading(false);
        }
    };

    // New: Fetch entity details based on ID and type
    const fetchEntityDetails = async (id, type) => {
        setLoading(true);
        try {
            const response = await getEntityDetails(id, type);
            setEntityDetails(response.data.entityDetails);
        } catch (error) {
            console.error("Error fetching entity details:", error);
            setError("Failed to fetch entity details");
        } finally {
            setLoading(false);
        }
    };

    // New: Reject notification and integrate nodemailer
    const rejectNotification = async (notificationId, reason) => {
        try {
            await rejectRegistration(notificationId, reason);
            toast.success("Rejection email sent successfully."); // Feedback for success
            fetchData(); // Refresh notifications after rejection
        } catch (error) {
            console.error("Error rejecting notification:", error);
            toast.error("Failed to reject notification."); // Feedback for error
        }
    };

    const addNotification = async (notificationData) => {
        try {
            await publishNotification(notificationData);
            const response = await getAllNotifications();
            setNotifications(response.data || []);
            return { success: true };
        } catch (error) {
            console.error("Error publishing notification:", error);
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
        entityDetails, // New: Expose entity details
        loading,
        error,
        counts,
        fetchEntityDetails, // New: Expose fetchEntityDetails function
        rejectNotification, // New: Expose rejectNotification function
        addNotification,
        fetchData,
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};