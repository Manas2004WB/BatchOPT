import React from "react";

const NavbarTabs = ({ activeTab, setActiveTab, user }) => {
  const tabs = ["sku", "batches", "tinter", "calibration"];

  return (
    <nav className="w-full bg-[#3dcd58] backdrop-blur-md shadow-md px-6 py-1.5 border-b border-green-500 z-10">
      <ul className="flex gap-4 font-medium tracking-wide text-md text-white">
        {tabs.map((tab) => (
          <li key={tab}>
            <button
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5  uppercase  transition-colors duration-150 ${
                activeTab === tab
                  ? "bg-white text-[#3dcd58]" // active
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavbarTabs;
