import React from "react";

const NavbarTabs = ({ activeTab, setActiveTab, user }) => {
  // base tabs visible to everyone
  const tabs = ["sku", "batches", "tinter", "calibration"];

  return (
    <nav className="w-full bg-[#3dcd58] backdrop-blur-md shadow px-8 py-2 border-b border-green-500 z-10">
      <ul className="flex gap-6 text-white font-medium text-sm tracking-wide">
        {tabs.map((tab) => (
          <li key={tab}>
            <button
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer px-2 pb-1 border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? "border-[#14532d] text-white font-semibold"
                  : "border-transparent text-[#d1fae5] hover:border-[#bbf7d0] hover:text-white hover:scale-105"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavbarTabs;
