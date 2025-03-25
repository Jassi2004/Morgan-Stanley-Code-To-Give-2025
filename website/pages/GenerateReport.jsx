import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GenerateReport = ({ isOpen, onClose, studentId }) => {
  const SKILL_CATEGORIES = [
    'Cognitive',
    'Communication',
    'Behavior',
    'Attention',
    'Others'
  ];

  const [formData, setFormData] = useState({
    studentId: studentId || '',
    monthlyScore: SKILL_CATEGORIES.map(skill => ({
      skillName: skill,
      marks: 0
    })),
    timeFrame: {
      month: '',
      year: new Date().getFullYear(),
      quarter: ''
    },
    remarks: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const updateSkill = (skillName, marks) => {
    setFormData(prev => ({
      ...prev,
      monthlyScore: prev.monthlyScore.map(skill => 
        skill.skillName === skillName ? { ...skill, marks: parseInt(marks) } : skill
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
      const requestData = {
        studentId: formData.studentId,
        monthlyScore: formData.monthlyScore,
        remarks: formData.remarks,
        timeFrame: {
          month: formData.timeFrame.month,
          year: formData.timeFrame.year.toString(),
          quarter: formData.timeFrame.quarter
        }
      };

      // First, generate monthly report
      const monthlyResponse = await fetch('http://localhost:8000/api/v1/student-report/generate-monthly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const monthlyData = await monthlyResponse.json();

      if (!monthlyResponse.ok) {
        throw new Error(monthlyData.message || 'Failed to generate monthly report');
      }

      // Then, update quarterly report
      const quarterlyResponse = await fetch('http://localhost:8000/api/v1/student-report/update-quarterly', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: formData.studentId,
          timeFrame: {
            quarter: formData.timeFrame.quarter,
            year: formData.timeFrame.year.toString()
          }
        })
      });

      const quarterlyData = await quarterlyResponse.json();

      if (!quarterlyResponse.ok) {
        throw new Error(quarterlyData.message || 'Failed to update quarterly report');
      }

      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          studentId: studentId || '',
          monthlyScore: SKILL_CATEGORIES.map(skill => ({
            skillName: skill,
            marks: 0
          })),
          timeFrame: {
            month: '',
            year: new Date().getFullYear(),
            quarter: ''
          },
          remarks: ''
        });
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Error generating report:', error);
      setError(error.message || 'Failed to generate report. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[var(--color-bg-primary)] p-6 rounded-lg shadow-2xl max-w-4xl w-full overflow-y-auto max-h-[90vh] pointer-events-auto border border-[var(--color-border-primary)]"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Generate Student Report</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-bg-secondary)] rounded-full text-[var(--color-text-secondary)]"
          >
            ×
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center py-12"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Report Generated Successfully!</h2>
              <p className="text-[var(--color-text-accent)] mt-2">Your report has been saved and is ready to view.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="space-y-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                    placeholder="Enter student ID"
                    required
                    disabled
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Skills Assessment
                  </label>
                  {SKILL_CATEGORIES.map((skillName) => (
                    <div key={skillName} className="flex gap-4 mb-4">
                      <div className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)]">
                        {skillName}
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={formData.monthlyScore.find(s => s.skillName === skillName)?.marks || 0}
                        onChange={(e) => updateSkill(skillName, e.target.value)}
                        className="w-24 px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                        placeholder="0-5"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Month
                    </label>
                    <select
                      value={formData.timeFrame.month}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        timeFrame: { ...prev.timeFrame, month: e.target.value }
                      }))}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                      required
                    >
                      <option value="">Select Month</option>
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.timeFrame.year}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        timeFrame: { ...prev.timeFrame, year: e.target.value }
                      }))}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Quarter
                    </label>
                    <select
                      value={formData.timeFrame.quarter}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        timeFrame: { ...prev.timeFrame, quarter: e.target.value }
                      }))}
                      className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                      required
                    >
                      <option value="">Select Quarter</option>
                      {quarters.map(quarter => (
                        <option key={quarter} value={quarter}>{quarter}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] h-32 resize-none"
                    placeholder="Enter remarks about the student's performance"
                    required
                  />
                </div>

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg border border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-6 py-2 bg-[var(--color-brand)] text-white rounded-lg hover:bg-[var(--color-brand-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-200"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Generating Report...</span>
                      </>
                    ) : (
                      'Generate Report'
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                  <span
                    className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    onClick={() => setError('')}
                  >
                    <svg
                      className="fill-current h-6 w-6 text-red-500"
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <title>Close</title>
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                  </span>
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GenerateReport;
