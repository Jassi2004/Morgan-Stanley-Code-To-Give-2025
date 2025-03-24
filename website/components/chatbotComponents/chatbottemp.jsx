import React, { useState, useRef, useContext } from "react";
import { IoIosSend } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { generateContent } from './Model'; // Your API call function
import ReactMarkdown from 'react-markdown';
import { AppContext } from "../../context/AppContext";

export default function ChatBot() {
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { students, employees } = useContext(AppContext);

  const data = [...(students || []), ...(employees || [])];
  

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
      setResponse([{ type: "system", message: "Please enter a prompt.." }]);
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
      console.error("Error generating response:", err);
      setResponse(prevResponse => [
        ...prevResponse,
        { type: "system", message: "Failed to generate response" },
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold tracking-wide">🤖 ChattyBot</h1>
        <button
          onClick={handleClear}
          className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition"
        >
          <MdDeleteSweep size={20} />
          <span>Clear</span>
        </button>
      </div>


      {/* Chat History */}
      <div className="flex flex-col flex-grow overflow-y-auto px-4 py-6 space-y-4">
        {response.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 animate-pulse">
            Got Questions? Chatty's Got Answers.
          </div>
        ) : (
          response.map((msg, index) => (
            <div
              key={index}
              className={`max-w-lg px-4 py-3 rounded-lg text-sm ${
                msg.type === "user"
                  ? "self-end bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md"
                  : msg.type === "bot"
                  ? "self-start bg-gray-700 text-gray-200 shadow"
                  : "self-center text-gray-400"
              }`}
            >
              <ReactMarkdown>{msg.message}</ReactMarkdown>
            </div>
          ))
        )}

        {isLoading && (
          <div className="self-center text-gray-400 animate-pulse">
            Generating response...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center px-4 py-3 bg-gray-800 border-t border-gray-700">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          onKeyDown={handleKeyPress}
          placeholder="Ask your question..."
          className="flex-grow mr-4 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 px-4 py-2 rounded-full text-white shadow-md transition flex items-center space-x-1"
        >
          <IoIosSend size={20} />
        </button>
      </div>
    </div>
  );
}
