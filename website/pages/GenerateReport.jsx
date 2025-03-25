import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GenerateReport = ({ isOpen, onClose, studentId }) => {
  const [formData, setFormData] = useState({
    studentId: studentId || '',
    skills: [{ skillName: '', marks: 0 }],
    timeFrame: {
      month: '',
      year: new Date().getFullYear(),
      quarter: ''
    },
    remarks: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { skillName: '', marks: 0 }]
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    setIsSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        studentId: studentId || '',
        skills: [{ skillName: '', marks: 0 }],
        timeFrame: {
          month: '',
          year: new Date().getFullYear(),
          quarter: ''
        },
        remarks: ''
      });
      onClose(); // Close the modal after success
    }, 2000);
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
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-4 mb-4">
                      <input
                        type="text"
                        value={skill.skillName}
                        onChange={(e) => updateSkill(index, 'skillName', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                        placeholder="Skill name"
                        required
                      />
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={skill.marks}
                        onChange={(e) => updateSkill(index, 'marks', parseInt(e.target.value))}
                        className="w-24 px-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                        placeholder="Marks (0-5)"
                        required
                      />
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center gap-2 text-[var(--color-brand)] hover:text-[var(--color-brand-dark)] transition-colors duration-200"
                  >
                    <Plus size={20} />
                    <span>Add Skill</span>
                  </button>
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
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GenerateReport;
