import React, { useContext, useState, useEffect } from 'react';
import { Users, GraduationCap, Star, FileText, TrendingUp, UserCheck, School, Bell, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import AttendanceChart from '../components/dashboardComponents/AttendanceChart';
import SessionSchedule from '../components/dashboardComponents/SessionSchedule';
import AdminNotificationPanel from '../components/dashboardComponents/AdminNotificationPanel';
import PerformanceGraph from '../components/dashboardComponents/PerformanceGraph';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const { counts, loading, error, addNotification } = useContext(AppContext);
  
  const [noticeText, setNoticeText] = useState('');
  const [publishLoading, setPublishLoading] = useState(false);
  const [notificationError, setNotificationError] = useState(null);
  
  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    id: '',
    name: '',
    rating: 0,
    remarks: ''
  });

  const stats = [
    {
      title: "Active Students",
      value: counts.activeStudents,
      total: counts.totalStudents,
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    {
      title: "Program Enrolled",
      value: "SPUHA",
      icon: School,
      color: "bg-purple-500",
      isText: true
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
      toast.success('Notification published successfully!');
    } catch (error) {
      toast.error('Failed to publish notification. Please try again.');
    } finally {
      setPublishLoading(false);
    }
  };

  const handleAssignmentSubmit = async () => {
    if (!assignmentForm.id || !assignmentForm.name || !assignmentForm.rating || !assignmentForm.remarks) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Add your API call here
      toast.success('Assignment marks published successfully!');
      setAssignmentForm({ id: '', name: '', rating: 0, remarks: '' });
    } catch (error) {
      toast.error('Failed to publish assignment marks');
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setAssignmentForm({ ...assignmentForm, rating: star })}
            className="focus:outline-none"
          >
            <Star
              className={`w-6 h-6 ${
                star <= assignmentForm.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
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
                  {stat.isText ? (
                    <p className="text-3xl font-semibold text-[var(--color-text-primary)]">
                      {stat.value}
                    </p>
                  ) : (
                    <>
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
                    </>
                  )}
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
          {/* Attendance Ratio */}
          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg border border-[var(--color-border-primary)]">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <span className="bg-[var(--color-brand)] p-2 rounded-lg">
                <UserCheck className="w-5 h-5 text-white" />
              </span>
              Attendance Statistics
            </h2>
            
            {/* Daily Average */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">Daily Average</p>
                  <p className="text-3xl font-medium text-[var(--color-text-primary)]">85%</p>
                </div>
                <span className="text-sm text-green-500 flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  +2.5% vs last week
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-green-500" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">Based on last 30 days</p>
            </div>

            {/* Monthly Breakdown */}
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Monthly Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[var(--color-bg-primary)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--color-text-secondary)]">March</p>
                  <p className="text-lg font-semibold text-[var(--color-text-primary)]">88%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div className="bg-[var(--color-bg-primary)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--color-text-secondary)]">February</p>
                  <p className="text-lg font-semibold text-[var(--color-text-primary)]">82%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div className="bg-[var(--color-bg-primary)] p-3 rounded-lg">
                  <p className="text-xs text-[var(--color-text-secondary)]">January</p>
                  <p className="text-lg font-semibold text-[var(--color-text-primary)]">85%</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quarterly Stats */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Quarterly Overview</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--color-text-secondary)]">Q1 2024</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--color-text-secondary)]">Q4 2023</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">79%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '79%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-[var(--color-text-secondary)]">Q3 2023</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">81%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '81%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assign Marks Section */}
          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border-primary)] shadow-lg">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <span className="bg-[var(--color-brand)] p-2 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </span>
              Assign Marks
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Assignment ID</label>
                <input
                  type="text"
                  value={assignmentForm.id}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, id: e.target.value })}
                  className="w-full p-2 mt-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]"
                  placeholder="Enter Assignment ID"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Assignment Name</label>
                <input
                  type="text"
                  value={assignmentForm.name}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, name: e.target.value })}
                  className="w-full p-2 mt-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]"
                  placeholder="Enter Assignment Name"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Rating</label>
                <div className="mt-2">{renderStars()}</div>
              </div>
              <div>
                <label className="text-sm text-[var(--color-text-secondary)]">Remarks</label>
                <textarea
                  value={assignmentForm.remarks}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, remarks: e.target.value })}
                  className="w-full p-2 mt-1 rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]"
                  rows="3"
                  placeholder="Enter your remarks"
                />
              </div>
              <button
                onClick={handleAssignmentSubmit}
                className="w-full py-2 bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors"
              >
                Publish Marks
              </button>
            </div>
          </div>
        </div>

        {/* Notice Board and Today's Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  rows={4}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[var(--color-bg-primary)] border-2 border-[var(--color-border-primary)] focus:outline-none focus:border-[var(--color-brand)]"
                  placeholder="Type your important message here..."
                />
              </div>
              <button
                onClick={handlePublishNotice}
                disabled={publishLoading || !noticeText.trim()}
                className={`w-full py-3 bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors ${
                  (publishLoading || !noticeText.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {publishLoading ? 'Publishing...' : 'Publish Notice'}
              </button>
            </div>
          </div>

          {/* Today's Sessions */}
          <SessionSchedule />
        </div>

        {/* Performance and Attendance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceGraph />
          <AttendanceChart />
        </div>
      </main>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default EmployeeDashboard;
