import React, { useContext, useState, Children, cloneElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../../context/AppContext';
import { Users, Calendar, FileText, Mail, Phone, Briefcase, Heart, Home, BookOpen, AlertCircle } from 'lucide-react';

// Stepper Component
const Stepper = ({ 
  children, 
  activeStep = 1, 
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = "Previous",
  nextButtonText = "Next",
  completeButtonText = "Submit",
  className = ""
}) => {
  const { darkMode } = useContext(AppContext);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isLastStep = activeStep === totalSteps;
  const [stepContentHeight, setStepContentHeight] = useState(0);

  const handleStepClick = (stepNumber) => {
    console.log('handleStepClick called with step:', stepNumber);
    if (stepNumber !== activeStep) {
      setDirection(stepNumber > activeStep ? 1 : -1);
      onStepChange(stepNumber);
    }
  };

  const handleNext = () => {
    console.log('handleNext called, isLastStep:', isLastStep);
    if (!isLastStep) {
      setDirection(1);
      onStepChange(activeStep + 1);
    }
  };

  const handleBack = () => {
    console.log('handleBack called, activeStep:', activeStep);
    if (activeStep > 1) {
      setDirection(-1);
      onStepChange(activeStep - 1);
    }
  };

  return (
    <div className={`max-w-3xl mx-auto ${className}`}>
      {/* Steps Indicator */}
      <div className="flex items-center justify-between mb-8">
        {stepsArray.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === activeStep;
          const isCompleted = stepNumber < activeStep;
          const isNotLastStep = index < totalSteps - 1;
          
          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle */}
              <div 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleStepClick(stepNumber)}
              >
                <motion.div
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                    isActive 
                      ? "bg-teal-500 text-white" 
                      : isCompleted 
                        ? "bg-teal-500 text-white" 
                        : darkMode 
                          ? "bg-gray-700 text-gray-400" 
                          : "bg-gray-200 text-gray-500"
                  }`}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5 text-white" />
                  ) : (
                    cloneElement(step.props.icon, { size: 18 })
                  )}
                </motion.div>
                <span className={`mt-2 text-sm font-medium ${
                  isActive 
                    ? darkMode ? "text-teal-400" : "text-teal-600" 
                    : darkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                  {step.props.label}
                </span>
              </div>
              
              {/* Connector Line */}
              {isNotLastStep && (
                <div className={`relative h-0.5 flex-1 mx-2 ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}>
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? "100%" : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className={`overflow-hidden`}>
      <motion.div
        style={{ position: "relative", overflow: "hidden" }}
        animate={{ height: stepContentHeight }}
        transition={{ type: "spring", duration: 0.4 }}
        className="w-full"
      >
        <AnimatePresence initial={false} mode="sync" custom={direction}>
          <motion.div
            key={activeStep}
            custom={direction}
            variants={{
              enter: (dir) => ({
                x: dir >= 0 ? "100%" : "-100%",
                opacity: 0,
              }),
              center: {
                x: "0%",
                opacity: 1,
              },
              exit: (dir) => ({
                x: dir >= 0 ? "-50%" : "50%",
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ position: "absolute", width: "100%" }}
            onLayoutAnimationComplete={() => {
              const content = document.getElementById(`step-content-${activeStep}`);
              if (content) {
                setStepContentHeight(content.offsetHeight);
              }
            }}
          >
            <div id={`step-content-${activeStep}`}>
              {stepsArray[activeStep - 1]}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>

    {/* Navigation Buttons */}
    <div className="mt-6">
      <div className={`flex ${activeStep === 1 ? "justify-end" : "justify-between"}`}>
        {activeStep > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 hover:bg-gray-600 text-white" 
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {backButtonText}
          </button>
        )}
        <button
          type={isLastStep ? "submit" : "button"}
          onClick={!isLastStep ? handleNext : undefined}
          className="bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white rounded-lg px-5 py-2 transition-colors duration-300"
        >
          {isLastStep ? completeButtonText : nextButtonText}
        </button>
      </div>
    </div>
  </div>
);
}

// Step Component
const Step = ({ children, label, icon }) => {
  return <div>{children}</div>;
};

Stepper.Step = Step;

// CheckIcon Component
const CheckIcon = (props) => {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
};

export default Stepper;