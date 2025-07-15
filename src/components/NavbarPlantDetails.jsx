import React from "react";
import { MdArrowBackIos } from "react-icons/md";

const NavbarPlantDetails = ({ activeTab, setActiveTab }) => {
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
          {["tinter", "sku", "batches"].map((tab) => (
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
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-1 bg-white text-cyan-800 font-medium text-sm px-4 py-1.5 rounded-md shadow hover:bg-gray-100 transition duration-200"
      >
        <MdArrowBackIos className="text-base" />
        <span>Back</span>
      </button>
    </nav>
  );
};

export default NavbarPlantDetails;
