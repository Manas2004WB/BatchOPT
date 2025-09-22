// components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  console.log("Navbar user prop:", user);
  return (
    <div className="w-full bg-[#3dcd58] backdrop-blur-md shadow-md px-8 py-4 flex justify-between items-center fixed top-0 left-0 z-50">
      <h2 className="text-xl font-bold text-white">
        Welcome, {user.Username}!
      </h2>
      <div className="flex flex-row items-center gap-6">
        <p className="text-gray-100 font-medium">{user.Email}</p>
        {user?.Role === "Admin" ? (
          <button
            className="text-white flex flex-row gap-1 justify-center items-center"
            onClick={() => navigate(`/setting`)}
          >
            <IoSettings />
            <span>Setting</span>
          </button>
        ) : null}
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
