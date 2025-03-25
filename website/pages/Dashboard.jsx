import React, { useContext, useState, useEffect } from 'react';
import { Users, GraduationCap, FileText, TrendingUp, UserCheck, School, Bell, Trash2, Target, Award } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import DashboardCard from '../components/dashboardComponents/DashboardCard';
import AttendanceChart from '../components/dashboardComponents/AttendanceChart';
import SessionSchedule from '../components/dashboardComponents/SessionSchedule';
import AdminNotificationPanel from '../components/dashboardComponents/AdminNotificationPanel';
import PerformanceGraph from '../components/dashboardComponents/PerformanceGraph';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from 'framer-motion';
import Orb from '../src/Backgrounds/Orb/Orb';

function DashBoard() {
  const navigate = useNavigate();
  const { counts, loading, error, addNotification } = useContext(AppContext);
  
  const [noticeText, setNoticeText] = useState('');
  const [publishLoading, setPublishLoading] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  
  const stats = [
    {
      title: "Active Students",
      value: counts.activeStudents,
      total: counts.totalStudents,
      icon: GraduationCap,
      color: "bg-blue-500",
      trend: "+12%",
      trendColor: "text-green-500",
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
    },
    {
      title: "Active Teachers",
      value: counts.activeTeachers,
      total: counts.totalTeachers,
      icon: Users,
      color: "bg-purple-500",
      trend: "+8%",
      trendColor: "text-green-500",
      bgImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Student-Teacher Ratio",
      value: counts.totalTeachers ? (counts.activeStudents / counts.activeTeachers).toFixed(1) : 0,
      icon: UserCheck,
      color: "bg-green-500",
      trend: "Optimal",
      trendColor: "text-green-500",
      bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      title: "Activity Rate",
      value: `${counts.totalStudents ? ((counts.activeStudents / counts.totalStudents) * 100).toFixed(1) : 0}%`,
      icon: Target,
      color: "bg-orange-500",
      trend: "+5%",
      trendColor: "text-green-500",
      bgImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

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
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const handlePublishNotice = async () => {
    if (!noticeText.trim()) {
      toast.error('Please enter a notification message');
      return;
    }

    setPublishLoading(true);
    try {
      await addNotification({
        message: noticeText,
        type: 'GENERAL',
        priority: 'NORMAL'
      });
      setNoticeText('');
      toast.success('Notification published successfully!');
    } catch (error) {
      toast.error('Failed to publish notification. Please try again.');
    } finally {
      setPublishLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-lg text-[var(--color-text-secondary)]">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300">
      <div>

      {/* <Orb/> */}

      </div>
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative h-64 bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-dark)] overflow-hidden rounded-b-3xl"
      >
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
            alt="Banner"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 h-full flex items-start">
          <div className="pt-24">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl font-bold text-white"
            >
              Welcome back, Admin!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-white/80 mt-3 text-lg"
            >
              Here's what's happening with your institution today.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20"
      >
        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              className="relative bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border-primary)] shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <img 
                  src={stat.bgImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${stat.trendColor}`}>
                    {stat.trend}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-[var(--color-text-secondary)]">{stat.title}</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {stat.value}
                  </p>
                  {stat.total && (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    out of {stat.total} total
                  </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Quick Stats */}
          <motion.div 
            variants={itemVariants}
            className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border-primary)] shadow-lg"
          >
            <Orb/>
            {/* <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2"
            >
              <span className="bg-[var(--color-brand)] p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </span>
              Quick Stats
            </motion.h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Student-Teacher Ratio</p>
                <p className="text-lg font-medium text-[var(--color-text-primary)]">
                  {counts.totalTeachers ? (counts.activeStudents / counts.activeTeachers).toFixed(1) : 0} : 1
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">(Active students to active teachers)</p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Activity Rate</p>
                <p className="text-lg font-medium text-[var(--color-text-primary)]">
                  Students: {counts.totalStudents ? ((counts.activeStudents / counts.totalStudents) * 100).toFixed(1) : 0}%
                  <br />
                  Teachers: {counts.totalTeachers ? ((counts.activeTeachers / counts.totalTeachers) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div> */}
          </motion.div>

          {/* Notice Board */}
          <motion.div 
            variants={itemVariants}
            className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border-primary)] shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2"
              >
                <span className="bg-[var(--color-brand)] p-2 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </span>
                Publish Notice
              </motion.h2>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  rows={4}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[var(--color-bg-primary)] border-2 border-[var(--color-border-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors duration-200"
                  placeholder="Type your important message here..."
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                  onClick={handlePublishNotice}
                  disabled={publishLoading || !noticeText.trim()}
                className={`w-full py-3 bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-all duration-200 ${
                  (publishLoading || !noticeText.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {publishLoading ? 'Publishing...' : 'Publish Notice'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts and Data */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <AdminNotificationPanel />
          <SessionSchedule />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <PerformanceGraph />
          <AttendanceChart />
        </motion.div>
      </motion.main>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default DashBoard;
