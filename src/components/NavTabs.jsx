import React from "react";

const NavbarTabs = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="w-full bg-green-100/60 backdrop-blur-md shadow px-8 py-2 border-b border-green-200 z-10">
      <ul className="flex gap-8 text-[#3dcd58] font-medium text-sm tracking-wide">
        {["sku", "batches", "tinter", "calibration"].map((tab) => (
          <li key={tab}>
            <button
              onClick={() => setActiveTab(tab)}
              className={`transition duration-200 pb-1 border-b-2 ${
                activeTab === tab
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent hover:border-green-400 hover:text-green-600"
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
