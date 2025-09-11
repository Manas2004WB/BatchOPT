import React, { useState } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const NavbarPlantDetails = ({ activeTab, setActiveTab, handleLogout }) => {
  const navigate = useNavigate();
  const doLogout = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white/60 backdrop-blur-md shadow-lg px-8 py-3 fixed top-0 left-0 z-50 flex justify-between items-center border-b border-gray-300">
      {/* Left Section: Title + Tabs */}
      <div className="flex items-center gap-10">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-cyan-800 tracking-wide">
          Plant Details
        </h1>

        {/* Tabs */}
        <ul className="flex gap-6 text-cyan-800 font-medium text-sm tracking-wide">
          {["sku", "batches", "tinter", "calibration"].map((tab) => (
            <li key={tab}>
              <button
                onClick={() => setActiveTab(tab)}
                className={`transition duration-200 pb-1 border-b-2 ${
                  activeTab === tab
                    ? "border-cyan-700 text-cyan-800"
                    : "border-transparent hover:border-cyan-500 hover:text-cyan-700"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section: Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 bg-white text-cyan-800 font-medium text-sm px-4 py-1.5 rounded-md shadow hover:bg-gray-100 transition duration-200"
        >
          <MdArrowBackIos className="text-base" />
          <span>Back</span>
        </button>
        <button
          onClick={doLogout}
          className="px-2 py-1 bg-cyan-700 text-white rounded-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarPlantDetails;
