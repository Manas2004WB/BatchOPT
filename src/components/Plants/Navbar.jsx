// components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { IoSettings } from "react-icons/io5";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#3dcd58] backdrop-blur-md shadow-lg px-8 py-4 flex justify-between items-center fixed top-0 left-0 z-50">
      {/* Left side: Logo / Greeting */}
      <div className="flex items-center gap-4">
        <span className="text-white/90 text-lg">
          | Welcome, {user.Username}
        </span>
      </div>

      {/* Right side: User info & actions */}
      <div className="flex items-center gap-4">
        <div className="px-3 py-1 bg-white/20 text-white rounded-lg font-medium text-sm">
          {user.Email}
        </div>

        {user?.Role === "Admin" && (
          <button
            onClick={() => navigate("/setting")}
            className="flex items-center gap-1 px-3 py-1 bg-green-700 hover:bg-green-800 rounded-lg text-white font-semibold transition-colors"
          >
            <IoSettings size={18} />
            Settings
          </button>
        )}

        <button
          onClick={onLogout}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
