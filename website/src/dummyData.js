// dummyData.js

export const Students = [
    {
      StudentId: "STU001",
      firstName: "Aarav",
      lastName: "Verma",
      studentEmail: "aarav.verma@example.com",
      password: "Password123",
      avatar: {
        public_id: "avatar_aarav_verma",
        secure_url: "https://example.com/avatar_aarav_verma.jpg"
      },
      gender: "Male",
      UDID: {
        isAvailable: true,
        public_id: "udid_aarav",
        secure_url: "https://example.com/udid_aarav.pdf"
      },
      dateOfBirth: "2015-06-15",
      primaryDiagnosis: "Autism",
      comorbidity: false,
      enrollmentYear: "2023-04-01",
      programs: [],
      numberOfSessions: 10,
      timings: "09:15 - 04:30",
      daysOfWeek: ["Monday", "Wednesday", "Friday"],
      educator: [],
      sessionType: "Offline",
      allergies: ["Peanuts"],
      transport: "Yes",
      address: "123, Green Park, Delhi",
      strengths: ["Drawing", "Puzzles"],
      weaknesses: ["Verbal Communication"],
      comments: "Very enthusiastic and creative.",
      status: true,
      guardianDetails: {
        name: "Rajesh Verma",
        relation: "Father",
        contactNumber: "9876543210"
      }
    },
    {
      StudentId: "STU002",
      firstName: "Diya",
      lastName: "Sharma",
      studentEmail: "diya.sharma@example.com",
      password: "Password123",
      avatar: {
        public_id: "avatar_diya_sharma",
        secure_url: "https://example.com/avatar_diya_sharma.jpg"
      },
      gender: "Female",
      UDID: {
        isAvailable: false,
        public_id: "",
        secure_url: "https://example.com/udid_diya.pdf"
      },
      dateOfBirth: "2014-12-05",
      primaryDiagnosis: "ADHD",
      comorbidity: true,
      enrollmentYear: "2022-06-10",
      programs: [],
      numberOfSessions: 15,
      timings: "09:15 - 04:30",
      daysOfWeek: ["Tuesday", "Thursday"],
      educator: [],
      sessionType: "Online",
      allergies: ["Gluten"],
      transport: "No",
      address: "456, Rose Garden, Chandigarh",
      strengths: ["Singing", "Memory Games"],
      weaknesses: ["Concentration"],
      comments: "Shows improvement in focus with personalized sessions.",
      status: true,
      guardianDetails: {
        name: "Anita Sharma",
        relation: "Mother",
        contactNumber: "9988776655"
      }
    }
  ];
  
  export const Teachers = [
    {
      employeeId: "EMP001",
      name: "Sanjay Kumar",
      gender: "MALE",
      email: "sanjay.kumar@example.com",
      password: "Password123",
      avatar: {
        public_id: "avatar_sanjay_kumar",
        secure_url: "https://example.com/avatar_sanjay_kumar.jpg"
      },
      designation: "Educator",
      department: "Special Education",
      role: "Employee",
      employmentType: "FTE",
      program: "Job Readiness",
      phone: "9876512340",
      DOB: "1990-03-20",
      dateOfJoining: "2020-01-15",
      dateOfLeaving: null,
      status: "Active",
      tenure: "3 Years",
      workLocation: "Academy",
      emergencyContact: {
        name: "Ramesh Kumar",
        contact: "9123456789"
      },
      bloodGroup: "B+"
    },
    {
      employeeId: "EMP002",
      name: "Priya Sen",
      gender: "FEMALE",
      email: "priya.sen@example.com",
      password: "Password123",
      avatar: {
        public_id: "avatar_priya_sen",
        secure_url: "https://example.com/avatar_priya_sen.jpg"
      },
      designation: "Jr. Program Associate",
      department: "Design",
      role: "Employee",
      employmentType: "Intern",
      program: "Spruha",
      phone: "9876501234",
      DOB: "1995-08-10",
      dateOfJoining: "2023-05-10",
      dateOfLeaving: null,
      status: "Active",
      tenure: "10 Months",
      workLocation: "Foundation",
      emergencyContact: {
        name: "Anil Sen",
        contact: "9012345678"
      },
      bloodGroup: "O+"
    }
  ];
  