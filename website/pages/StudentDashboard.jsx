import React from 'react';

const StudentDashboard = () => {

    const student = {
        StudentId: "STU12345",
        approval: {
            status: "approved",
            reason: "All criteria met."
        },
        firstName: "John",
        lastName: "Doe",
        studentEmail: "john.doe@example.com",
        password: "securepassword123", // This should be hashed in a real application
        avatar: {
            public_id: "avatar123",
            secure_url: "https://via.placeholder.com/150"
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
            primary: "EDU001", // Assuming this is an ObjectId reference to an educator
            secondary: "EDU002" // Assuming this is an ObjectId reference to an educator
        },
        sessionType: "Online",
        allergies: ["Peanuts", "Dairy"],
        transport: true,
        address: "123 Main St, Anytown, USA",
        strengths: ["Good at math", "Excellent communication skills"],
        weaknesses: ["Struggles with reading", "Needs assistance with fine motor skills"],
        comments: "John is a bright student with a lot of potential.",
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
    
    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <div className="relative">
                        <img
                            className="w-full h-48 object-cover"
                            src="https://via.placeholder.com/800x300"
                            alt="Cover"
                        />
                        <div className="absolute bottom-0 left-4 -mb-16">
                            <img
                                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800"
                                src={student.avatar.secure_url || "https://via.placeholder.com/150"}
                                alt="Student"
                            />
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold">{student.firstName} {student.lastName}</h2>
                            <p className="text-gray-600 dark:text-gray-400">Student ID: {student.StudentId}</p>
                            <p className="text-sm mt-2">
                                Status:{' '}
                                <span className={`font-semibold ${student.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                                    {student.status}
                                </span>
                            </p>
                        </div>
                        <div className="mt-8 space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-inner">
                                <h3 className="text-lg font-semibold">Contact Information</h3>
                                <p className="mt-2">Email: {student.studentEmail}</p>
                                <p>Phone: {student.contactNumber}</p>
                                <p>Parent Email: {student.parentEmail}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-inner">
                                <h3 className="text-lg font-semibold">Education & Program</h3>
                                <p className="mt-2">Program: {student.program}</p>
                                <p>Secondary Program: {student.program2}</p>
                                <p>Enrollment Year: {new Date(student.enrollmentYear).getFullYear()}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-inner">
                                <h3 className="text-lg font-semibold">Medical & Special Needs</h3>
                                <p className="mt-2">Primary Diagnosis: {student.primaryDiagnosis}</p>
                                <p>Comorbidity: {student.comorbidity ? "Yes" : "No"}</p>
                                <p>Allergies: {student.allergies.length ? student.allergies.join(", ") : "None"}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-inner">
                                <h3 className="text-lg font-semibold">Timings & Sessions</h3>
                                <p className="mt-2">Timings: {student.timings}</p>
                                <p>Days of Week: {student.daysOfWeek.join(", ")}</p>
                                <p>Session Type: {student.sessionType}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md shadow-inner">
                                <h3 className="text-lg font-semibold">Additional Info</h3>
                                <p className="mt-2">Strengths: {student.strengths.join(", ") || "N/A"}</p>
                                <p>Weaknesses: {student.weaknesses.join(", ") || "N/A"}</p>
                                <p>Comments: {student.comments || "No comments"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
