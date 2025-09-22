import React, { useState } from "react";
import UserRolesMatser from "../components/Master/MasterForms/UserRolesMaster";
import BatchStatusMaster from "../components/Master/MasterForms/BatchStatusMaster";
import CalibrationTypeMaster from "../components/Master/MasterForms/CalibrationTypeMaster";
import { MdArrowBackIos } from "react-icons/md";

const mastersList = [
  { key: "user-role", label: "User Roles" },
  { key: "calibration types", label: "Calibration Types" },
  { key: "batchStatus", label: "Batch Status" },
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
      default:
        return <div>Select a master from the sidebar</div>;
    }
  };

  return (
    <div className="flex max-h-[100vh] min-h-[100vh]">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 bg-green-100 shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Masters</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-red-500 font-bold hover:text-red-700"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-2">
            {mastersList.map((master) => (
              <li key={master.key}>
                <button
                  onClick={() => setActiveMaster(master.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeMaster === master.key
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-blue-100"
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
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600"
          >
            ☰ Masters
          </button>
        )}
        {renderMasterForm()}
      </div>
      <div className="pr-3 pt-3">
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
