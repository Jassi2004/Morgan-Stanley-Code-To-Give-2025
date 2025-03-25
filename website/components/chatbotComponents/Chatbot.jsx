import React, { useState, useContext, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { IoIosSend } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { generateContent } from './Model';
import ReactMarkdown from 'react-markdown';
import { AppContext } from "../../context/AppContext";
import { FaStarOfLife } from "react-icons/fa";
import { RiLineChartFill  } from "react-icons/ri";
import Orb from "../../src/Backgrounds/Orb/Orb";

export default function IshanyaAI({ isOpen, onClose }) {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundEffect, setBackgroundEffect] = useState(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const { students, employees } = useContext(AppContext);

  const data = [...(students || []), ...(employees || [])];

  // Quantum-inspired background effect generator
  const generateQuantumBackground = () => {
    const particles = Array(50).fill().map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));

    return (
      <svg className="absolute inset-0 z-0 opacity-50" viewBox="0 0 100 100">
        {particles.map((particle, index) => (
          <motion.circle
            key={index}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={particle.color}
            animate={{
              x: [particle.x, particle.x + Math.random() * 10 - 5],
              y: [particle.y, particle.y + Math.random() * 10 - 5],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.1
            }}
          />
        ))}
      </svg>
    );
  };

  useEffect(() => {
    if (isOpen) {
      setBackgroundEffect(generateQuantumBackground());
    }
  }, [isOpen]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleClear = () => {
    setUserInput('');
    setResponse([]);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setResponse([{ type: "system", message: "Quantum consciousness awaits your query..." }]);
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Given the following student data: ${JSON.stringify(data)}. Answer the question: ${userInput}`;
      const resFunc = await generateContent(prompt);
      const res = resFunc();

      setResponse(prevResponse => [
        ...prevResponse,
        { type: "user", message: userInput },
        { type: "bot", message: res },
      ]);
      setUserInput('');
    } catch (err) {
      console.error("Quantum error:", err);
      setResponse(prevResponse => [
        ...prevResponse,
        { type: "system", message: "Quantum entanglement disrupted. Recalibrating..." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      >
        {backgroundEffect}
        <motion.div
          initial={{ scale: 0.7, rotateX: 30, rotateY: -30, opacity: 0 }}
          animate={{ scale: 1, rotateX: 0, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.7, rotateX: 30, rotateY: -30, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 0.5
          }}
          className="relative w-[95vw] h-[95vh] bg-black/90 rounded-3xl shadow-2xl border-4 border-cyan-500/30 overflow-hidden perspective-1000 transform-style-3d"
        >
          {/* Holographic Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 bg-gradient-to-r from-black/80 to-black/50 backdrop-blur-xl border-b border-cyan-500/20">
            <div className="flex items-center space-x-4">
              <FaStarOfLife className="text-cyan-400 text-3xl animate-pulse" />
              <h1 className="text-3xl font-extralight tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
                ISHANYA.AI
              </h1>
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ rotate: 360, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                className="bg-red-500/20 hover:bg-red-500/40 p-3 rounded-full transition text-red-300"
              >
                <MdDeleteSweep size={24} />
              </motion.button>
              <motion.button
                whileHover={{ rotate: 180, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="bg-cyan-500/20 hover:bg-cyan-500/40 p-3 rounded-full transition text-cyan-300"
              >
                ✖
              </motion.button>
            </div>
          </div>

          {/* Chat History with Holographic Effect */}
          <div 
            ref={chatContainerRef}
            className="absolute top-24 bottom-28 left-6 right-6 overflow-y-auto custom-scrollbar px-6 py-4 space-y-6 bg-black/30 rounded-2xl border border-cyan-500/10"
          >
            {response.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <Orb/>
              </div>
            ) : (
              response.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.type === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div 
                    className={`
                      max-w-3xl px-6 py-4 rounded-3xl text-base 
                      ${msg.type === "user" 
                        ? "bg-gradient-to-tr from-cyan-700/80 to-blue-800/80 text-white" 
                        : msg.type === "bot" 
                        ? "bg-gray-900/70 text-gray-100 border border-cyan-500/30" 
                        : "bg-gray-800/50 text-gray-300"}
                      backdrop-blur-xl shadow-2xl transform transition-all hover:scale-[1.02]
                    `}
                  >
                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                  </div>
                </motion.div>
              ))
            )}

            {isLoading && (
              <div className="flex justify-center items-center space-x-4 text-cyan-400 animate-pulse">
                <div className="w-4 h-4 bg-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-4 h-4 bg-cyan-500 rounded-full animate-bounce delay-300"></div>
              </div>
            )}
          </div>

          {/* Quantum Input Zone */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent border-t border-cyan-500/20">
            <div className="flex items-center space-x-4">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleUserInput}
                onKeyDown={handleKeyPress}
                placeholder="How many students are currently studying..."
                className="flex-grow px-6 py-4 rounded-full bg-gray-900/70 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all backdrop-blur-xl tracking-wide"
              />
              <motion.button
                whileHover={{ scale: 1.2, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSubmit}
                className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 p-4 rounded-full text-white shadow-2xl transition flex items-center"
              >
                <IoIosSend size={28} className="text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}