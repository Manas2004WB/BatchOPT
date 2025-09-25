import React, { useState } from "react";
import UserRolesMatser from "../components/Master/MasterForms/UserRolesMaster";
import BatchStatusMaster from "../components/Master/MasterForms/BatchStatusMaster";
import CalibrationTypeMaster from "../components/Master/MasterForms/CalibrationTypeMaster";
import { MdArrowBackIos } from "react-icons/md";
import UserMasters from "../components/Master/MasterForms/UserMasters";

const mastersList = [
  { key: "user-role", label: "User Roles" },
  { key: "calibration types", label: "Calibration Types" },
  { key: "batchStatus", label: "Batch Status" },
  { key: "users", label: "Users" },
];

const MainComponent = () => {
  const [activeMaster, setActiveMaster] = useState("batchStatus");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderMasterForm = () => {
    switch (activeMaster) {
      case "user-role":
        return <UserRolesMatser />;
      case "calibration types":
        return <CalibrationTypeMaster />;
      case "batchStatus":
        return <BatchStatusMaster />;
      case "users":
        return <UserMasters />;
      default:
        return <div>Select a master from the sidebar</div>;
    }
  };

  return (
    <div className="flex max-h-[100vh] min-h-[100vh] bg-gray-50">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 bg-green-100 shadow-lg p-4 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-green-900">Masters</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-red-500 font-bold hover:text-red-700 transition"
            >
              ✕
            </button>
          </div>

          {/* Sidebar Menu */}
          <ul className="flex-1 space-y-2">
            {mastersList.map((master) => (
              <li key={master.key}>
                <button
                  onClick={() => setActiveMaster(master.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeMaster === master.key
                      ? "bg-emerald-500 text-white shadow-md"
                      : "hover:bg-green-200"
                  }`}
                >
                  {master.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto relative">
        {/* Sidebar Toggle */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 transition duration-200"
          >
            ☰ Masters
          </button>
        )}

        {/* Render Selected Master Form */}
        {renderMasterForm()}
      </div>

      {/* Back Button */}
      <div className="absolute top-3 right-4 z-50">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1 bg-[#3dcd58] text-white font-medium text-sm px-4 py-1.5 rounded-md shadow hover:bg-green-700 transition duration-200"
        >
          <MdArrowBackIos className="text-base" />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};

export default MainComponent;
