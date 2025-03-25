import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Calendar,
  Award,
  TrendingUp,
  Book,
  Star,
  ChevronRight,
  ChevronDown,
  MessageSquare,
  Target,
  Activity,
  Brain,
  Users,
  MessageCircle,
  Focus,
  Heart
} from 'lucide-react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// Hardcoded data for demonstration
const mockMonthlyData = [
  { month: 'January', Cognitive: 4, Communication: 3, Behaviour: 4, Attention: 3, Social: 4 },
  { month: 'February', Cognitive: 3, Communication: 4, Behaviour: 3, Attention: 4, Social: 3 },
  { month: 'March', Cognitive: 5, Communication: 4, Behaviour: 4, Attention: 5, Social: 4 },
];

const mockOverallScores = [
  { month: 'January', score: 3.6 },
  { month: 'February', score: 3.8 },
  { month: 'March', score: 4.2 },
];

const mockQuarterlyOverallScores = [
  { quarter: 'Q1 2023', score: 3.5 },
  { quarter: 'Q2 2023', score: 3.8 },
  { quarter: 'Q3 2023', score: 4.0 },
  { quarter: 'Q4 2023', score: 4.2 },
  { quarter: 'Q1 2024', score: 4.5 },
];

const mockSkillsData = [
  { subject: 'Cognitive', A: 4, fullMark: 5 },
  { subject: 'Communication', A: 5, fullMark: 5 },
  { subject: 'Behaviour', A: 4, fullMark: 5 },
  { subject: 'Attention', A: 3, fullMark: 5 },
  { subject: 'Social', A: 4, fullMark: 5 },
];

const mockPieData = {
  cognitive: [
    { name: 'Problem Solving', value: 85 },
    { name: 'Memory', value: 75 },
    { name: 'Critical Thinking', value: 90 },
  ],
  social: [
    { name: 'Peer Interaction', value: 80 },
    { name: 'Empathy', value: 85 },
    { name: 'Group Work', value: 70 },
  ],
  communication: [
    { name: 'Verbal', value: 85 },
    { name: 'Non-verbal', value: 75 },
    { name: 'Written', value: 80 },
  ],
};

const COLORS = [
  'var(--color-brand)',
  'var(--color-brand-light)',
  'var(--color-accent)',
  'var(--color-accent-light)',
  'var(--color-accent-dark)'
];

const mockTestScores = [
  { name: 'Math Assessment', score: 4.5, date: '2024-03-15' },
  { name: 'Language Skills', score: 4.2, date: '2024-03-20' },
  { name: 'Cognitive Test', score: 3.8, date: '2024-03-25' },
  { name: 'Social Skills Evaluation', score: 4.3, date: '2024-03-27' },
  { name: 'Behavioral Assessment', score: 4.1, date: '2024-03-28' },
  { name: 'Communication Skills', score: 4.4, date: '2024-03-29' },
  { name: 'Problem Solving Test', score: 4.0, date: '2024-03-30' },
];

const mockQuarterlyTestScores = [
  { name: 'Quarterly Math Evaluation', score: 4.3, date: '2024-03-30' },
  { name: 'Communication Assessment', score: 4.0, date: '2024-03-30' },
  { name: 'Behavioral Analysis', score: 4.2, date: '2024-03-30' },
  { name: 'Cognitive Development Review', score: 4.5, date: '2024-03-30' },
  { name: 'Social Integration Assessment', score: 4.1, date: '2024-03-30' },
  { name: 'Life Skills Evaluation', score: 4.3, date: '2024-03-30' },
  { name: 'Academic Progress Review', score: 4.4, date: '2024-03-30' },
];

const mockTeacherRemarks = {
  cognitive: "Strong improvement in problem-solving abilities. Shows excellent progress in memory tasks.",
  social: "Demonstrates good peer interaction skills. Need to work on group participation.",
  communication: "Verbal skills have significantly improved. Written communication needs attention.",
  attention: "Shows increased focus during morning sessions. Afternoon attention span needs improvement.",
  behavior: "Positive behavioral changes observed. Responds well to positive reinforcement."
};

const mockQuarterlyRemarks = {
  cognitive: "Consistent improvement in cognitive abilities throughout Q1. Excelling in problem-solving.",
  social: "Notable progress in social interactions. Group participation has improved significantly.",
  communication: "Strong development in communication skills. Written expression shows marked improvement.",
  attention: "Attention span has increased substantially. Better focus during complex tasks.",
  behavior: "Excellent behavioral progress. Shows maturity in handling challenging situations."
};

// Add these mock data constants after other mock data
const mockAttendanceData = [
  { name: 'Present', value: 90 },
  { name: 'Excused', value: 7 },
  { name: 'Absent', value: 3 },
];

const mockSkillBreakdown = {
  monthly: [
    { skill: 'Task Completion', current: 85, previous: 75 },
    { skill: 'Following Instructions', current: 90, previous: 85 },
    { skill: 'Time Management', current: 80, previous: 70 },
  ],
  quarterly: [
    { skill: 'Task Completion', current: 88, previous: 78 },
    { skill: 'Following Instructions', current: 92, previous: 82 },
    { skill: 'Time Management', current: 85, previous: 75 },
  ]
};

const ViewReport = ({ studentId, onClose }) => {
  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');

  const renderPieChart = (data, title, icon) => (
    <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      </div>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={400}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                padding: '8px 12px'
              }}
              itemStyle={{
                color: '#ffffff'
              }}
              labelStyle={{
                color: '#ffffff',
                fontWeight: 'bold'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => (
                <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAnalysisSection = (isQuarterly = false) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Skills Progress Chart */}
        <div className="col-span-1 bg-[var(--color-bg-secondary)] p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Skills Progress</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={mockSkillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Progress Chart */}
        <div className="col-span-2 bg-[var(--color-bg-secondary)] p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Overall Progress</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={isQuarterly ? mockQuarterlyOverallScores : mockOverallScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={isQuarterly ? "quarter" : "month"} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Charts */}
        <div className="col-span-1">
          {renderPieChart(
            mockPieData.cognitive, 
            "Cognitive Skills", 
            <Brain className="text-[var(--color-brand)] w-6 h-6" />
          )}
        </div>
        <div className="col-span-1">
          {renderPieChart(
            mockPieData.social, 
            "Social Skills", 
            <Users className="text-[var(--color-brand)] w-6 h-6" />
          )}
        </div>
        <div className="col-span-1">
          {renderPieChart(
            mockPieData.communication, 
            "Communication", 
            <MessageCircle className="text-[var(--color-brand)] w-6 h-6" />
          )}
        </div>

        {/* Test Scores and Additional Analysis */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Scores */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Recent Assessments</h2>
              <button 
                className="text-sm text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors duration-200 flex items-center gap-1"
                onClick={() => {/* Add view all functionality */}}
              >
                View All
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {(isQuarterly ? mockQuarterlyTestScores : mockTestScores).slice(0, 6).map((test, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg hover:bg-opacity-90 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[var(--color-brand)] bg-opacity-10">
                      <Award className="text-[var(--color-brand)]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--color-text-primary)]">{test.name}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)]">{test.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-[var(--color-brand)]">{test.score}</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">/5.0</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Attendance and Participation */}
          <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Attendance & Participation</h2>
            <div className="h-[200px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockAttendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={400}
                  >
                    {mockAttendanceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '8px 12px'
                    }}
                    itemStyle={{
                      color: '#ffffff'
                    }}
                    labelStyle={{
                      color: '#ffffff',
                      fontWeight: 'bold'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => (
                      <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 mt-8 pt-6 border-t border-[var(--color-border)]">
              {mockSkillBreakdown[isQuarterly ? 'quarterly' : 'monthly'].map((item, index) => (
                <div key={index} className="bg-[var(--color-bg-primary)] p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{item.skill}</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {item.current}% (+{item.current - item.previous}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.current}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="h-full bg-[var(--color-brand)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Teacher's Remarks */}
        <div className="col-span-1 bg-[var(--color-bg-secondary)] p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">Teacher's Remarks</h2>
          <div className="space-y-4">
            {Object.entries(isQuarterly ? mockQuarterlyRemarks : mockTeacherRemarks).map(([category, remark], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[var(--color-bg-primary)] py-4 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 cursor-help"
                data-tooltip-id={`remark-${category}`}
                data-tooltip-content={remark}
              >
                <div className="flex items-center gap-3">
                  {category === 'cognitive' && <Brain className="text-[var(--color-brand)] w-6 h-6" />}
                  {category === 'social' && <Users className="text-[var(--color-brand)] w-6 h-6" />}
                  {category === 'communication' && <MessageCircle className="text-[var(--color-brand)] w-6 h-6" />}
                  {category === 'attention' && <Focus className="text-[var(--color-brand)] w-6 h-6" />}
                  {category === 'behavior' && <Activity className="text-[var(--color-brand)] w-6 h-6" />}
                  <h3 className="text-base font-medium text-[var(--color-text-primary)] capitalize">{category}</h3>
                </div>
              </motion.div>
            ))}
            <ReactTooltip 
              id="remark-cognitive"
              place="right"
              className="max-w-xs !bg-[var(--color-bg-secondary)] !text-[var(--color-text-primary)]"
            />
            <ReactTooltip 
              id="remark-social"
              place="right"
              className="max-w-xs !bg-[var(--color-bg-secondary)] !text-[var(--color-text-primary)]"
            />
            <ReactTooltip 
              id="remark-communication"
              place="right"
              className="max-w-xs !bg-[var(--color-bg-secondary)] !text-[var(--color-text-primary)]"
            />
            <ReactTooltip 
              id="remark-attention"
              place="right"
              className="max-w-xs !bg-[var(--color-bg-secondary)] !text-[var(--color-text-primary)]"
            />
            <ReactTooltip 
              id="remark-behavior"
              place="right"
              className="max-w-xs !bg-[var(--color-bg-secondary)] !text-[var(--color-text-primary)]"
            />
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--color-border)] text-center">
            <p className="text-xs text-[var(--color-text-secondary)]">
              Hover over subjects to view remarks
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Student Progress Report</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('monthly')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'monthly'
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'
                }`}
              >
                Monthly Analysis
              </button>
              <button
                onClick={() => setActiveTab('quarterly')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === 'quarterly'
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'
                }`}
              >
                Quarterly Analysis
              </button>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-brand)] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400" 
                    alt="John Smith"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">John Smith</h2>
                  <p className="text-[var(--color-text-secondary)]">ID: STU2024001</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-[var(--color-brand)] bg-opacity-10">
                  <Book className="text-[var(--color-brand)]" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)]">Program</h3>
                  <p className="text-[var(--color-text-secondary)]">Special Education</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-[var(--color-brand)] bg-opacity-10">
                  <Star className="text-[var(--color-brand)]" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--color-text-primary)]">Overall Progress</h3>
                  <p className="text-[var(--color-text-secondary)]">4.2/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analysis Sections */}
        {activeTab === 'monthly' && renderAnalysisSection(false)}
        {activeTab === 'quarterly' && renderAnalysisSection(true)}
      </div>
    </div>
  );
};

export default ViewReport;
