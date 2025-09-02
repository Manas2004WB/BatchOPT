// components/Navbar.jsx
import React from "react";

const Navbar = ({ user, onLogout }) => {
  console.log("Navbar user prop:", user);
  return (
    <div className="w-full bg-white/60 backdrop-blur-md shadow-md px-8 py-4 flex justify-between items-center fixed top-0 left-0 z-50 ">
      <h2 className="text-xl font-bold text-gray-800">
        Welcome, {user.Username}!
      </h2>
      <div className="flex flex-row items-center gap-4">
        <p className="text-gray-700 font-medium">Email: {user.Email}</p>
        <button
          onClick={onLogout}
          className="px-2 py-1 bg-cyan-700 text-white rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
