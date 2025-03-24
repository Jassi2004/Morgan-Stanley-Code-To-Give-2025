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
  HeartHandshake,
  Shield,
  Settings,
  BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';

function AdminProfile() {
  // Dummy data - in real app, this would come from API
  const adminData = {
    name: "Dr. Michael Chen",
    designation: "Administrative Director",
    department: "Administration",
    program: "All Programs",
    employmentType: "FTE",
    email: "michael.chen@example.com",
    phone: "+91 98765 43212",
    workLocation: "Headquarters",
    dateOfJoining: "2020-01-10",
    tenure: "4 Years",
    bloodGroup: "A+",
    emergencyContact: {
      name: "Sarah Chen",
      contact: "+91 98765 43213"
    },
    certifications: [
      {
        name: "Educational Leadership",
        issuer: "National Institute of Educational Leadership",
        year: "2021",
        description: "Advanced certification in educational administration and leadership"
      },
      {
        name: "Project Management Professional",
        issuer: "Project Management Institute",
        year: "2020",
        description: "Professional certification in project management"
      },
      {
        name: "Strategic Planning",
        issuer: "Business Leadership Institute",
        year: "2019",
        description: "Specialized training in strategic planning and organizational development"
      }
    ],
    currentRoles: [
      {
        title: "Administrative Director",
        program: "All Programs",
        duration: "2020 - Present",
        responsibilities: [
          "Overseeing all program operations and strategic initiatives",
          "Leading cross-functional teams and departments",
          "Developing and implementing organizational policies",
          "Managing budget allocation and resource planning"
        ]
      }
    ],
    pastRoles: [
      {
        title: "Program Manager",
        program: "Special Education",
        duration: "2018 - 2020",
        responsibilities: [
          "Managed multiple special education programs",
          "Led program expansion initiatives",
          "Developed staff training programs",
          "Implemented quality assurance measures"
        ]
      }
    ],
    managementMetrics: {
      programsManaged: 5,
      teamSize: 50,
      annualBudget: "₹2.5 Cr",
      successRate: "95%"
    }
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
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
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
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-[var(--color-bg-primary)] object-cover"
                />
              </motion.div>
              <div className="flex-1">
                <motion.h1 
                  variants={itemVariants}
                  className="text-3xl font-bold text-[var(--color-text-primary)]"
                >
                  {adminData.name}
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="text-lg text-[var(--color-text-secondary)]"
                >
                  {adminData.designation}
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center gap-4 mt-4"
                >
                  <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Shield className="w-4 h-4" />
                    {adminData.program}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Users className="w-4 h-4" />
                    {adminData.department}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Management Metrics */}
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
                  <BarChart className="w-5 h-5 text-white" />
                </span>
                Management Metrics
              </motion.h2>
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-[var(--color-brand)]">{adminData.managementMetrics.programsManaged}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Programs Managed</p>
                </div>
                <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-[var(--color-brand)]">{adminData.managementMetrics.teamSize}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Team Size</p>
                </div>
                <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-[var(--color-brand)]">{adminData.managementMetrics.annualBudget}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Annual Budget</p>
                </div>
                <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg text-center">
                  <h3 className="text-2xl font-bold text-[var(--color-brand)]">{adminData.managementMetrics.successRate}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Success Rate</p>
                </div>
              </motion.div>
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
                  <span>{adminData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-brand)]" />
                  <span>{adminData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-brand)]" />
                  <span>{adminData.workLocation}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-brand)]" />
                  <span>Joined {new Date(adminData.dateOfJoining).toLocaleDateString()}</span>
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
                {adminData.certifications.map((cert, index) => (
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
              {adminData.currentRoles.map((role, index) => (
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
              {adminData.pastRoles.map((role, index) => (
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

export default AdminProfile;