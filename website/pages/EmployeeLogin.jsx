import React from "react";

const EmployeeLogin = () => {
  return (
    <div className="bg-[#yourEmployeeLoginColor] min-h-screen flex justify-center items-center">
      <form className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Employee Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 mb-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-2 mb-2 border rounded" />
        <button className="w-full bg-green-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default EmployeeLogin;