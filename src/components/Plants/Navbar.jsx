import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoSettings, IoLogOut } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-[#3dcd58] backdrop-blur-md shadow-lg px-8 py-4 flex justify-between items-center fixed top-0 left-0 z-50">
      {/* Left side: Logo / Greeting */}
      <div className="flex items-center gap-4">
        <span className="text-white/90 text-lg">
          | Welcome, {user.Username}
        </span>
      </div>

      {/* Right side: User info & dropdown */}
      <div className="flex items-center gap-4">
        <div className="px-3 py-1 bg-white/30 text-white rounded-lg font-medium text-sm">
          {user.Email}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-white hover:text-gray-100"
          >
            <FaUserCircle size={28} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {user?.Role === "Admin" && (
                <button
                  onClick={() => {
                    navigate("/setting");
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <IoSettings size={16} />
                  Settings
                </button>
              )}
              <button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <IoLogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
