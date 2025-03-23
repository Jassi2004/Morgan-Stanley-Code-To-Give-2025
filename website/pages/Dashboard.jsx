import React, { useContext, useState, useEffect } from 'react';
import { Users, GraduationCap, FileText, TrendingUp, UserCheck, School, Bell, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import DashboardCard from '../components/dashboardComponents/DashboardCard';
import AttendanceChart from '../components/dashboardComponents/AttendanceChart';
import SessionSchedule from '../components/dashboardComponents/SessionSchedule';
import AdminNotificationPanel from '../components/dashboardComponents/AdminNotificationPanel';
import PerformanceGraph from '../components/dashboardComponents/PerformanceGraph';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";

function DashBoard() {
  const navigate = useNavigate();
  const { counts, loading, error, addNotification } = useContext(AppContext);
  // console.log(notifications);
  
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
    },
    {
      title: "Active Teachers",
      value: counts.activeTeachers,
      total: counts.totalTeachers,
      icon: Users,
      color: "bg-purple-500",
    }
  ];

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
      toast.success('Notification published successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Failed to publish notification. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setPublishLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await removeNotification(notificationId);
      setNotificationError(null);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setNotificationError('Failed to delete notification');
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border-primary)] shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-[var(--color-text-secondary)]">{stat.title}</p>
                  <p className="text-3xl font-semibold text-[var(--color-text-primary)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    out of {stat.total} total
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className={`h-2.5 rounded-full ${stat.color}`}
                      style={{ 
                        width: `${stat.total ? (stat.value / stat.total * 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className={`p-4 rounded-full ${stat.color}`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border-primary)]">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Quick Stats</h2>
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
            </div>
          </div>
          {/* Notice Board */}
          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border-primary)] shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span className="bg-[var(--color-brand)] p-2 rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </span>
                Publish Notice
              </h2>
            </div>
            {notificationError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {notificationError}
              </div>
            )}
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  id="notice"
                  rows={4}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand-light)] transition-all placeholder-[var(--color-text-secondary)] text-base"
                  placeholder="Type your important message here..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePublishNotice}
                  disabled={publishLoading || !noticeText.trim()}
                  className={`flex-1 py-3 px-6 bg-[var(--color-brand)] text-white font-medium rounded-xl transition-all transform hover:translate-y-[-2px] hover:shadow-lg flex items-center justify-center gap-2 ${
                    (publishLoading || !noticeText.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--color-brand-dark)]'
                  }`}
                >
                  <span>{publishLoading ? 'Publishing...' : 'Publish Notice'}</span>
                  {!publishLoading && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AdminNotificationPanel />
          <SessionSchedule />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceGraph />
          <AttendanceChart />
        </div>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>

  );
}

export default DashBoard;
