import React from 'react';
import { Users, GraduationCap, FileText, TrendingUp } from 'lucide-react';
import DashboardCard from '../components/dashboardComponents/DashboardCard';
import AttendanceChart from '../components/dashboardComponents/AttendanceChart';
import SessionSchedule from '../components/dashboardComponents/SessionSchedule';
import NotificationPanel from '../components/dashboardComponents/NotificationPanel';
import PerformanceGraph from '../components/dashboardComponents/PerformanceGraph';
import { useNavigate } from 'react-router-dom';

function DashBoard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-300">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
          <DashboardCard
            title="Total Students"
            value="156"
            change="+5 this month"
            icon={
              <GraduationCap className="w-6 h-6 text-[var(--color-brand)]" />
            }
            actionLabel="Add Students"
            onClick={() => navigate('/students/add')}
          />
          <DashboardCard
            title="Teachers"
            value="24"
            change="20 Active"
            icon={
              <Users className="w-6 h-6 text-[var(--color-brand)]" />
            }
            actionLabel="Add Teacher"
            onClick={() => navigate('/teachers/add')}
          />
          <DashboardCard
            title="Reports"
            value="45"
            change="12 pending review"
            icon={
              <FileText className="w-6 h-6 text-[var(--color-brand)]" />
            }
            actionLabel="View Reports"
          />
          <DashboardCard
            title="Progress"
            value="85%"
            change="↑ 10% this month"
            icon={
              <TrendingUp className="w-6 h-6 text-[var(--color-brand)]" />
            }
            actionLabel="View Details"
          />
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
