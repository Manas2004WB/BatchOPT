import React, { useState } from "react";
// NavbarTop.jsx
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const NavbarTop = ({ handleLogout }) => {
  const navigate = useNavigate();

  const doLogout = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white/70 backdrop-blur-md px-8 py-3 flex justify-between items-center z-20">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-[#3dcd58] tracking-wide">
        Plant Details
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate("/dashboard");
            }
          }}
          className="flex items-center gap-1 bg-white text-green-800 font-medium text-sm px-4 py-1.5 rounded-md shadow hover:bg-green-50 transition duration-200"
        >
          <MdArrowBackIos className="text-base" />
          <span>Back</span>
        </button>

        <button
          onClick={doLogout}
          className="px-2 py-1 bg-[#3dcd58] hover:bg-green-700 text-white rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarTop;
