// components/Navbar.jsx
import React from "react";

const Navbar = ({ user, onLogout }) => {
  console.log("Navbar user prop:", user);
  return (
    <div className="w-full bg-green-500 backdrop-blur-md shadow-md px-8 py-4 flex justify-between items-center fixed top-0 left-0 z-50">
      <h2 className="text-xl font-bold text-white">
        Welcome, {user.Username}!
      </h2>
      <div className="flex flex-row items-center gap-4">
        <p className="text-gray-100 font-medium">Email: {user.Email}</p>
        <button
          onClick={onLogout}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
