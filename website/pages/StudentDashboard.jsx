import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    const student = JSON.parse(localStorage.getItem("studentData"))?.student;

    const student1 = {
        StudentId: "STU12345",
        approval: {
            status: "approved",
            reason: "All criteria met."
        },
        firstName: "John",
        lastName: "Doe",
        studentEmail: "john.doe@example.com",
        password: "securepassword123",
        avatar: {
            public_id: "avatar123",
            secure_url: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        gender: "Male",
        UDID: {
            isAvailable: true,
            public_id: "udid123",
            secure_url: "https://via.placeholder.com/150"
        },
        dateOfBirth: new Date("2000-01-15"),
        primaryDiagnosis: "Autism",
        comorbidity: false,
        enrollmentYear: new Date("2022-09-01"),
        program: "Job Readiness",
        program2: "Vocation",
        numberOfSessions: 20,
        timings: "09:00 - 11:00",
        daysOfWeek: ["Monday", "Wednesday", "Friday"],
        educators: {
            primary: "EDU001",
            secondary: "EDU002"
        },
        sessionType: "Online",
        allergies: ["Peanuts", "Dairy"],
        transport: true,
        address: "123 Main St, Anytown, USA",
        strengths: ["Good at math", "Excellent communication skills"],
        weaknesses: ["Struggles with reading", "Needs assistance with fine motor skills"],
        comments: "John is a bright student? with a lot of potential.",
        status: "Active",
        fathersName: "James Doe",
        mothersName: "Jane Doe",
        parentEmail: "parents@example.com",
        contactNumber: 1234567890,
        altContactNumber: 1987654321,
        certifications: [
            "Graphic designer from Lorem ipsum in 2018",
            "Product designer from Lorem ipsum in 2019",
            "Logo designer from Lorem ipsum in 2020"
        ],
        roles: [
            "Student Representative",
            "Peer Mentor"
        ],
        refreshToken: "dummyRefreshToken123"
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Helmet>
                    <title>{student?.firstName} {student?.lastName} | Student Dashboard</title>
                    <meta name="description" content="Student dashboard with personal and academic information" />
                </Helmet>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
                    </header>

                    {/* Profile Card */}
                    <div className="rounded-xl shadow-lg overflow-hidden mb-8 bg-white dark:bg-gray-800 transition-colors duration-300">
                        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                            <div className="absolute -bottom-16 left-6">
                                <img
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                                    src={student?.avatar?.secure_url || "https://cdn-icons-png.flaticon.com/512/1154/1154987.png"}
                                    alt={`${student?.firstName} ${student?.lastName}`}
                                />
                            </div>
                        </div>

                        <div className="pt-20 pb-6 px-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student?.firstName} {student?.lastName}</h2>
                                    <p className="text-gray-600 dark:text-gray-400">ID: {student?.StudentId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Program</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{student?.program}</p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
                                <nav className="-mb-px flex space-x-8">
                                    {['overview', 'academic', 'medical', 'family'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize ${
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
                                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
                                        </div>
                                        <div className="px-6 py-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                                                    <p className="text-gray-900 dark:text-white">{formatDate(student?.dateOfBirth)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.gender}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.studentEmail}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.contactNumber}</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Academic Information</h3>
                                        </div>
                                        <div className="px-6 py-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Enrollment Year</p>
                                                    <p className="text-gray-900 dark:text-white">{new Date(student?.enrollmentYear).getFullYear()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Primary Program</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.program}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Secondary Program</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.program2}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Session Type</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.sessionType}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Timings</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.timings}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Days</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.daysOfWeek.join(", ")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Academic Tab */}
                            {activeTab === 'academic' && (
                                <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Academic Details</h3>
                                    </div>
                                    <div className="px-6 py-4 space-y-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Program Information</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Primary Program</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.program}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Secondary Program</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.program2}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Enrollment Date</p>
                                                    <p className="text-gray-900 dark:text-white">{formatDate(student?.enrollmentYear)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Number of Sessions</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.numberOfSessions}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Schedule</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Session Type</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.sessionType}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Timings</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.timings}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Days</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.daysOfWeek.join(", ")}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Transport</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.transport ? "Available" : "Not Available"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Educators</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Primary Educator</p>
                                                    <p className="text-gray-900 dark:text-white">Educator #{student?.educators?.primary}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Secondary Educator</p>
                                                    <p className="text-gray-900 dark:text-white">Educator #{student?.educators?.secondary}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Certifications</h4>
                                            <ul className="list-disc pl-5 space-y-1 text-gray-900 dark:text-white">
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
                                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Medical Information</h3>
                                    </div>
                                    <div className="px-6 py-4 space-y-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Diagnosis</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Primary Diagnosis</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.primaryDiagnosis}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Comorbidity</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.comorbidity ? "Yes" : "No"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Allergies</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {student?.allergies.length > 0 ? (
                                                    student?.allergies?.map((allergy, index) => (
                                                        <span key={index} className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-50 dark:text-red-200">
                                                            {allergy}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400">No known allergies</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Strengths & Weaknesses</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h5 className="text-sm font-medium mb-2 text-green-600 dark:text-green-400">Strengths</h5>
                                                    <ul className="space-y-2">
                                                        {student?.strengths?.map((strength, index) => (
                                                            <li key={index} className="flex items-start text-gray-900 dark:text-white">
                                                                <span className="mr-2 text-green-600 dark:text-green-400">✓</span>
                                                                <span>{strength}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-medium mb-2 text-yellow-600 dark:text-yellow-400">Areas for Improvement</h5>
                                                    <ul className="space-y-2">
                                                        {student?.weaknesses?.map((weakness, index) => (
                                                            <li key={index} className="flex items-start text-gray-900 dark:text-white">
                                                                <span className="mr-2 text-yellow-600 dark:text-yellow-400">⚠</span>
                                                                <span>{weakness}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Additional Notes</h4>
                                            <p className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                                                {student?.comments || "No additional comments."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Family Tab */}
                            {activeTab === 'family' && (
                                <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Family Information</h3>
                                    </div>
                                    <div className="px-6 py-4 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Father's Information</h4>
                                                <div className="space-y-2">
                                                    <p className="text-gray-900 dark:text-white">
                                                        <span className="block text-sm text-gray-500 dark:text-gray-400">Name</span>
                                                        {student?.fathersName}
                                                    </p>
                                                    <p className="text-gray-900 dark:text-white">
                                                        <span className="block text-sm text-gray-500 dark:text-gray-400">Contact</span>
                                                        {student?.contactNumber}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Mother's Information</h4>
                                                <div className="space-y-2">
                                                    <p className="text-gray-900 dark:text-white">
                                                        <span className="block text-sm text-gray-500 dark:text-gray-400">Name</span>
                                                        {student?.mothersName}
                                                    </p>
                                                    <p className="text-gray-900 dark:text-white">
                                                        <span className="block text-sm text-gray-500 dark:text-gray-400">Contact</span>
                                                        {student?.altContactNumber}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Information</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Primary Email</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.parentEmail}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Emergency Contact</p>
                                                    <p className="text-gray-900 dark:text-white">{student?.altContactNumber}</p>
                                                </div>
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
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Stats</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg text-center bg-blue-50 dark:bg-blue-900 dark:bg-opacity-50">
                                            <p className="text-sm text-blue-600 dark:text-blue-300">Sessions</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{student?.numberOfSessions}</p>
                                        </div>
                                        <div className="p-3 rounded-lg text-center bg-green-50 dark:bg-green-900 dark:bg-opacity-50">
                                            <p className="text-sm text-green-600 dark:text-green-300">Status</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{student?.status}</p>
                                        </div>
                                        <div className="p-3 rounded-lg text-center bg-purple-50 dark:bg-purple-900 dark:bg-opacity-50">
                                            <p className="text-sm text-purple-600 dark:text-purple-300">Program</p>
                                            <p className="text-xl font-bold truncate text-gray-900 dark:text-white">{student?.program}</p>
                                        </div>
                                        <div className="p-3 rounded-lg text-center bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-50">
                                            <p className="text-sm text-yellow-600 dark:text-yellow-300">Years</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {new Date().getFullYear() - new Date(student?.enrollmentYear).getFullYear()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Roles & Responsibilities */}
                            <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Roles</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="space-y-3">
                                        <p className="text-gray-900 dark:text-white">Student</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Schedule */}
                            <div className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300">
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Schedule</h3>
                                </div>
                                <div className="px-6 py-4">
                                    <div className="space-y-4">
                                        {student?.daysOfWeek?.map((day, index) => (
                                            <div key={index} className="flex items-center">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                                                    <span className="text-xs font-medium text-gray-900 dark:text-white">{day.substring(0, 3)}</span>
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{index + 10}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="font-medium text-gray-900 dark:text-white">{student?.program} Session</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {student?.timings} • {student?.sessionType}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="mt-4 w-full py-2 rounded-md font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white">
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