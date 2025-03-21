import React, { useContext } from 'react';
import { Users, GraduationCap, FileText, TrendingUp, UserCheck, School } from 'lucide-react';
import DashboardCard from '../components/dashboardComponents/DashboardCard';
import AttendanceChart from '../components/dashboardComponents/AttendanceChart';
import SessionSchedule from '../components/dashboardComponents/SessionSchedule';
import NotificationPanel from '../components/dashboardComponents/NotificationPanel';
import PerformanceGraph from '../components/dashboardComponents/PerformanceGraph';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";

function DashBoard() {
  const navigate = useNavigate();
  const { counts, loading, error } = useContext(AppContext);
  
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
  console.log(stats);
  
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
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-blue-100 dark:border-gray-700 shadow-lg transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <span className="bg-blue-500 p-2 rounded-lg">
                  📢
                </span>
                Publish Notice
              </h2>
            </div>
            <div className="space-y-6">
              <div className="relative">
                
                <textarea
                  id="notice"
                  rows={4}
                  className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-gray-700 text-[var(--color-text-primary)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all placeholder-gray-400 text-base"
                  placeholder="Type your important message here..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all transform hover:translate-y-[-2px] hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Publish Notice</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                
              </div>
            </div>
          </div>
          {/* Recent Activity */}
          {/* <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border-primary)]">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-[var(--color-text-secondary)]">No recent activity to display</p>
            </div>
          </div> */}
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AttendanceChart />
          <SessionSchedule />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceGraph />
          <NotificationPanel />
        </div>
      </main>
    </div>
  );
}

export default DashBoard;
