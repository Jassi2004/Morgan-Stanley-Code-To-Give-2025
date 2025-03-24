import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  Users,
  School,
  HeartHandshake
} from 'lucide-react';
import { motion } from 'framer-motion';

function EmployeeProfile() {
  // Dummy data - in real app, this would come from API
  const employeeData = {
    name: "Dr. Sarah Johnson",
    designation: "Senior Special Educator",
    department: "Special Education",
    program: "Spruha",
    employmentType: "FTE",
    email: "sarah.johnson@example.com",
    phone: "+91 98765 43210",
    workLocation: "Foundation",
    dateOfJoining: "2022-03-15",
    tenure: "2 Years",
    bloodGroup: "O+",
    emergencyContact: {
      name: "John Johnson",
      contact: "+91 98765 43211"
    },
    certifications: [
      {
        name: "Special Education Certification",
        issuer: "National Institute of Special Education",
        year: "2021",
        description: "Advanced certification in teaching neurodivergent children"
      },
      {
        name: "Applied Behavior Analysis",
        issuer: "Behavior Analysis Certification Board",
        year: "2020",
        description: "Professional certification in ABA therapy"
      },
      {
        name: "Sensory Integration Therapy",
        issuer: "Sensory Integration Institute",
        year: "2019",
        description: "Specialized training in sensory processing disorders"
      }
    ],
    currentRoles: [
      {
        title: "Lead Special Educator",
        program: "Spruha",
        duration: "2022 - Present",
        responsibilities: [
          "Leading a team of 5 special educators",
          "Developing individualized education plans",
          "Conducting parent-teacher meetings"
        ]
      }
    ],
    pastRoles: [
      {
        title: "Special Educator",
        program: "Suyog",
        duration: "2020 - 2022",
        responsibilities: [
          "Teaching life skills to neurodivergent children",
          "Implementing behavioral therapy techniques",
          "Documenting student progress"
        ]
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const coverVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const profileImageVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        duration: 0.8,
        bounce: 0.4
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300"
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Photo */}
        <motion.div 
          variants={coverVariants}
          className="relative h-64 rounded-xl overflow-hidden mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-dark)]">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
              alt="Cover"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        </motion.div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div 
              variants={itemVariants}
              className="flex items-start gap-6"
            >
              <motion.div 
                variants={profileImageVariants}
                className="relative -mt-20"
              >
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-[var(--color-bg-primary)] object-cover"
                />
              </motion.div>
              <div className="flex-1">
                <motion.h1 
                  variants={itemVariants}
                  className="text-3xl font-bold text-[var(--color-text-primary)]"
                >
                  {employeeData.name}
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-lg text-[var(--color-text-secondary)]"
                >
                  {employeeData.designation}
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-4 mt-4"
                >
                  <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <School className="w-4 h-4" />
                    {employeeData.program}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Users className="w-4 h-4" />
                    {employeeData.department}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border-primary)]"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-xl font-semibold mb-4 flex items-center gap-2"
              >
                <span className="bg-[var(--color-brand)] p-2 rounded-lg">
                  <HeartHandshake className="w-5 h-5 text-white" />
                </span>
                Contact Information
              </motion.h2>
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--color-brand)]" />
                  <span>{employeeData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-brand)]" />
                  <span>{employeeData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-brand)]" />
                  <span>{employeeData.workLocation}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-brand)]" />
                  <span>Joined {new Date(employeeData.dateOfJoining).toLocaleDateString()}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Certifications */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border-primary)]"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-xl font-semibold mb-4 flex items-center gap-2"
              >
                <span className="bg-[var(--color-brand)] p-2 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </span>
                Certifications
              </motion.h2>
              <motion.div 
                variants={itemVariants}
                className="space-y-4"
              >
                {employeeData.certifications.map((cert, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="bg-[var(--color-bg-primary)] p-4 rounded-lg"
                  >
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{cert.name}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{cert.issuer} • {cert.year}</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2">{cert.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Roles */}
          <div className="space-y-6">
            {/* Current Role */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border-primary)]"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-xl font-semibold mb-4 flex items-center gap-2"
              >
                <span className="bg-[var(--color-brand)] p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </span>
                Current Role
              </motion.h2>
              {employeeData.currentRoles.map((role, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="space-y-3"
                >
                  <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{role.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{role.program} • {role.duration}</p>
                  </div>
                  <ul className="list-disc list-inside text-sm text-[var(--color-text-secondary)] space-y-1">
                    {role.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>

            {/* Past Roles */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border-primary)]"
            >
              <motion.h2 
                variants={itemVariants}
                className="text-xl font-semibold mb-4 flex items-center gap-2"
              >
                <span className="bg-[var(--color-brand)] p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </span>
                Past Roles
              </motion.h2>
              {employeeData.pastRoles.map((role, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="space-y-3 mb-4 last:mb-0"
                >
                  <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{role.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{role.program} • {role.duration}</p>
                  </div>
                  <ul className="list-disc list-inside text-sm text-[var(--color-text-secondary)] space-y-1">
                    {role.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

export default EmployeeProfile; 