import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const student = JSON.parse(localStorage.getItem("studentData"))?.student;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };



    return (
        <>
            {/* Root container with explicit light/dark bg and transition */}
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Helmet>
                    <title>{student?.firstName} {student?.lastName} | Student Dashboard</title>
                    <meta name="description" content="Student dashboard with personal and academic information" />
                </Helmet>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                            Student Dashboard
                        </h1>
                    </header>

                    {/* Profile Card */}
                    <div className="rounded-xl shadow-lg overflow-hidden mb-8 bg-white dark:bg-gray-800 transition-colors duration-300">
                        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                            <div className="absolute -bottom-16 left-6">
                                <img
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-md transition-colors duration-300"
                                    src={student?.avatar?.secure_url || "https://cdn-icons-png.flaticon.com/512/1154/1154987.png"}
                                    alt={`${student?.firstName} ${student?.lastName}`}
                                />
                            </div>
                        </div>

                        <div className="pt-20 pb-6 px-6 transition-colors duration-300">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                                        {student?.firstName} {student?.lastName}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                        ID: {student?.StudentId}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Program</p>
                                    <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                        {student?.program}
                                    </p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="mt-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                <nav className="-mb-px flex space-x-8">
                                    {['overview', 'academic', 'medical', 'family'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-300 ${
                                                activeTab === tab
                                                    ? 'border-blue-500 text-blue-600 dark:border-purple-500 dark:text-purple-400'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-300'
                                            }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                                Personal Information
                                            </h3>
                                        </div>
                                        <div className="px-6 py-4 transition-colors duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Date of Birth', value: formatDate(student?.dateOfBirth) },
                                                    { label: 'Gender', value: student?.gender },
                                                    { label: 'Email', value: student?.studentEmail },
                                                    { label: 'Contact', value: student?.contactNumber },
                                                ].map((item, index) => (
                                                    <div key={index}>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                            {item.label}
                                                        </p>
                                                        <p className="text-gray-900 dark:text-white transition-colors duration-300">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                ))}
                                                <div className="md:col-span-2">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Address</p>
                                                    <p className="text-gray-900 dark:text-white transition-colors duration-300">
                                                        {student?.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                                Academic Information
                                            </h3>
                                        </div>
                                        <div className="px-6 py-4 transition-colors duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Enrollment Year', value: new Date(student?.enrollmentYear).getFullYear() },
                                                    { label: 'Primary Program', value: student?.program },
                                                    { label: 'Secondary Program', value: student?.program2 },
                                                    { label: 'Session Type', value: student?.sessionType },
                                                    { label: 'Timings', value: student?.timings },
                                                    { label: 'Days', value: student?.daysOfWeek?.join(", ") },
                                                ].map((item, index) => (
                                                    <div key={index}>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                            {item.label}
                                                        </p>
                                                        <p className="text-gray-900 dark:text-white transition-colors duration-300">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Academic Tab */}
                            {activeTab === 'academic' && (
                                <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                            Academic Details
                                        </h3>
                                    </div>
                                    <div className="px-6 py-4 space-y-6 transition-colors duration-300">
                                        {/* Sections with consistent light/dark text */}
                                        {[
                                            {
                                                title: "Program Information",
                                                items: [
                                                    { label: 'Primary Program', value: student?.program },
                                                    { label: 'Secondary Program', value: student?.program2 },
                                                    { label: 'Enrollment Date', value: formatDate(student?.enrollmentYear) },
                                                    { label: 'Number of Sessions', value: student?.numberOfSessions },
                                                ]
                                            },
                                            {
                                                title: "Schedule",
                                                items: [
                                                    { label: 'Session Type', value: student?.sessionType },
                                                    { label: 'Timings', value: student?.timings },
                                                    { label: 'Days', value: student?.daysOfWeek?.join(", ") },
                                                    { label: 'Transport', value: student?.transport ? "Available" : "Not Available" },
                                                ]
                                            }
                                        ].map((section, sectionIndex) => (
                                            <div key={sectionIndex}>
                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                                    {section.title}
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {section.items.map((item, itemIndex) => (
                                                        <div key={itemIndex}>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                                {item.label}
                                                            </p>
                                                            <p className="text-gray-900 dark:text-white transition-colors duration-300">
                                                                {item.value}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Certifications */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                                Certifications
                                            </h4>
                                            <ul className="list-disc pl-5 space-y-1 text-gray-900 dark:text-white transition-colors duration-300">
                                                {student?.certifications?.map((cert, index) => (
                                                    <li key={index}>{cert}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Medical Tab */}
                            {activeTab === 'medical' && (
                                <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                            Medical Information
                                        </h3>
                                    </div>
                                    <div className="px-6 py-4 space-y-6 transition-colors duration-300">
                                        {/* Diagnosis */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                                Diagnosis
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Primary Diagnosis', value: student?.primaryDiagnosis },
                                                    { label: 'Comorbidity', value: student?.comorbidity ? "Yes" : "No" },
                                                ].map((item, index) => (
                                                    <div key={index}>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                            {item.label}
                                                        </p>
                                                        <p className="text-gray-900 dark:text-white transition-colors duration-300">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Allergies */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                                Allergies
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {student?.allergies?.length > 0 ? (
                                                    student.allergies.map((allergy, index) => (
                                                        <span 
                                                            key={index}
                                                            className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 transition-colors duration-300"
                                                        >
                                                            {allergy}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                        No known allergies
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Strengths & Weaknesses */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                                Strengths & Weaknesses
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h5 className="text-sm font-medium mb-2 text-green-600 dark:text-green-400 transition-colors duration-300">
                                                        Strengths
                                                    </h5>
                                                    <ul className="space-y-2">
                                                        {student?.strengths?.map((strength, index) => (
                                                            <li 
                                                                key={index} 
                                                                className="flex items-start text-gray-900 dark:text-white transition-colors duration-300"
                                                            >
                                                                <span className="mr-2 text-green-600 dark:text-green-400">✓</span>
                                                                <span>{strength}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-medium mb-2 text-yellow-600 dark:text-yellow-400 transition-colors duration-300">
                                                        Areas for Improvement
                                                    </h5>
                                                    <ul className="space-y-2">
                                                        {student?.weaknesses?.map((weakness, index) => (
                                                            <li 
                                                                key={index} 
                                                                className="flex items-start text-gray-900 dark:text-white transition-colors duration-300"
                                                            >
                                                                <span className="mr-2 text-yellow-600 dark:text-yellow-400">⚠</span>
                                                                <span>{weakness}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Notes */}
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                                Additional Notes
                                            </h4>
                                            <p className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300">
                                                {student?.comments || "No additional comments."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Family Tab */}
                            {activeTab === 'family' && (
                                <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                            Family Information
                                        </h3>
                                    </div>
                                    <div className="px-6 py-4 space-y-6 transition-colors duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                {
                                                    title: "Father's Information",
                                                    items: [
                                                        { label: 'Name', value: student?.fathersName },
                                                        { label: 'Contact', value: student?.contactNumber }
                                                    ]
                                                },
                                                {
                                                    title: "Mother's Information",
                                                    items: [
                                                        { label: 'Name', value: student?.mothersName },
                                                        { label: 'Contact', value: student?.altContactNumber }
                                                    ]
                                                }
                                            ].map((parent, index) => (
                                                <div key={index}>
                                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                                        {parent.title}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {parent.items.map((item, itemIndex) => (
                                                            <div key={itemIndex} className="text-gray-900 dark:text-white transition-colors duration-300">
                                                                <span className="block text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                                    {item.label}
                                                                </span>
                                                                {item.value}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                                                Contact Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Primary Email', value: student?.parentEmail },
                                                    { label: 'Emergency Contact', value: student?.altContactNumber }
                                                ].map((item, index) => (
                                                    <div key={index}>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                            {item.label}
                                                        </p>
                                                        <p className="text-gray-900 dark:text-white transition-colors duration-300">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                        Quick Stats
                                    </h3>
                                </div>
                                <div className="px-6 py-4 transition-colors duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { 
                                                label: 'Sessions', 
                                                value: student?.numberOfSessions,
                                                color: 'blue'
                                            },
                                            { 
                                                label: 'Status', 
                                                value: student?.status,
                                                color: 'green'
                                            },
                                            { 
                                                label: 'Program', 
                                                value: student?.program,
                                                color: 'purple'
                                            },
                                            { 
                                                label: 'Years', 
                                                value: new Date().getFullYear() - new Date(student?.enrollmentYear).getFullYear(),
                                                color: 'yellow'
                                            }
                                        ].map((stat, index) => (
                                            <div 
                                                key={index}
                                                className={`p-3 rounded-lg text-center bg-${stat.color}-50 dark:bg-${stat.color}-900 dark:bg-opacity-50 transition-colors duration-300`}
                                            >
                                                <p className={`text-sm text-${stat.color}-600 dark:text-${stat.color}-300 transition-colors duration-300`}>
                                                    {stat.label}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                                                    {stat.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Roles & Responsibilities */}
                            <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                        Roles
                                    </h3>
                                </div>
                                <div className="px-6 py-4 transition-colors duration-300">
                                    <div className="space-y-3 text-gray-900 dark:text-white transition-colors duration-300">
                                        <p>Student</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Schedule */}
                            <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                        Upcoming Schedule
                                    </h3>
                                </div>
                                <div className="px-6 py-4 transition-colors duration-300">
                                    <div className="space-y-4">
                                        {student?.daysOfWeek?.map((day, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 transition-colors duration-300">
                                                    <span className="text-xs font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                                        {day.substring(0, 3)}
                                                    </span>
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                                                        {index + 10}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                                        {student?.program} Session
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                                                        {student?.timings} • {student?.sessionType}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="mt-4 w-full py-2 rounded-md font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors duration-300">
                                        View Full Calendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}