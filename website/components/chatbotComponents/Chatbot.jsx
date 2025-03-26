import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosSend } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { generateContent } from './Model';
import ReactMarkdown from 'react-markdown';
import { AppContext } from "../../context/AppContext";
import { FaStarOfLife } from "react-icons/fa";
import Orb from "../../src/Backgrounds/Orb/Orb";

export default function IshanyaAI({ isOpen, onClose }) {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { students, employees , reports} = useContext(AppContext);

  const data = [...(students || []), ...(employees || []) , ...(reports || [])];

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

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center space-x-2 py-2">
      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-100"></div>
      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-200"></div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0.8 }}
          transition={{ type: "tween", duration: 0.2 }}
          className="relative w-[95vw] h-[95vh] bg-black/90 rounded-3xl shadow-2xl border-4 border-cyan-500/30 overflow-hidden"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 bg-gradient-to-r from-black/80 to-black/50 backdrop-blur-xl border-b border-cyan-500/20">
            <div className="flex items-center space-x-4">
              <FaStarOfLife className="text-cyan-400 text-3xl" />
              <h1 className="text-3xl font-extralight tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
                ISHANYA.AI
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleClear}
                className="bg-red-500/20 hover:bg-red-500/40 p-3 rounded-full transition text-red-300"
              >
                <MdDeleteSweep size={24} />
              </button>
              <button
                onClick={onClose}
                className="bg-cyan-500/20 hover:bg-cyan-500/40 p-3 rounded-full transition text-cyan-300"
              >
                ✖
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="absolute top-24 bottom-28 left-6 right-6 overflow-y-auto custom-scrollbar px-6 py-4 space-y-6 bg-black/30 rounded-2xl border border-cyan-500/10">
            {response.length === 0 ? (
              <Orb/>
            ) : (
              <>
                {response.map((msg, index) => (
                  <div
                    key={index}
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
                        backdrop-blur-xl shadow-lg
                      `}
                    >
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                
                {isLoading && <LoadingIndicator />}
              </>
            )}
          </div>

          {/* Input Zone */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent border-t border-cyan-500/20">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={userInput}
                onChange={handleUserInput}
                onKeyDown={handleKeyPress}
                placeholder="How many students are currently enrolled..."
                className="flex-grow px-6 py-4 rounded-full bg-gray-900/70 text-white placeholder-cyan-300/50 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all backdrop-blur-xl tracking-wide"
              />
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 p-4 rounded-full text-white shadow-2xl transition flex items-center"
              >
                <IoIosSend size={28} className="text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}