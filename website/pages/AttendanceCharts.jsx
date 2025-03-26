import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import axios from "axios";
import { useParams } from "react-router-dom";

const AttendanceChart = () => {
    const { studentId } = useParams();
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/attendance/get/${studentId}`);
                setAttendanceData(response.data.data);
    } catch (err) {
                setError("Failed to fetch attendance records.");
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [studentId]);

    if (loading) return <p className="text-center text-lg font-semibold">Loading attendance data...</p>;
    if (error) return <p className="text-center text-lg text-red-500">{error}</p>;
    if (!attendanceData.length) return <p className="text-center text-lg text-gray-500">No attendance records available.</p>;

    // Process Data for Graphs
    const monthlyAttendance = attendanceData.map(record => ({
        month: record.report[0].month,
        present: record.report[0].status.filter(day => day === "P").length,
        absent: record.report[0].status.filter(day => day === "A").length,
    }));

    const totalDays = monthlyAttendance.reduce((acc, curr) => acc + curr.present + curr.absent, 0);
    const presentDays = monthlyAttendance.reduce((acc, curr) => acc + curr.present, 0);
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">Attendance Report</h2>

            {/* Bar Chart */}
            <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 text-center">Monthly Attendance</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyAttendance}>
                        <XAxis dataKey="month" stroke="#8884d8" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="present" fill="#4CAF50" name="Present Days" />
                        <Bar dataKey="absent" fill="#F44336" name="Absent Days" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="mt-6 flex flex-col items-center">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Overall Attendance</h3>
                <ResponsiveContainer width={300} height={300}>
                    <PieChart>
                        <Pie
                            data={[
                                { name: "Present", value: presentDays },
                                { name: "Absent", value: totalDays - presentDays },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            <Cell key="present" fill="#4CAF50" />
                            <Cell key="absent" fill="#F44336" />
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-2">
                    Attendance: {attendancePercentage.toFixed(2)}%
                </p>
            </div>
        </div>
    );
};

export default AttendanceChart;
