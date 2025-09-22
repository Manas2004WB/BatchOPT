import React, { useState } from "react";
import UserRolesMatser from "./MasterForms/UserRolesMaster";
import BatchStatusMaster from "./MasterForms/BatchStatusMaster";
import CalibrationTypeMaster from "./MasterForms/CalibrationTypeMaster";

const mastersList = [
  { key: "user-role", label: "User Roles" },
  // { key: "roles", label: "Roles" },
  // { key: "plants", label: "Plants" },
  // { key: "skus", label: "SKUs" },
  { key: "calibration types", label: "Calibration Types" },
  { key: "batchStatus", label: "Batch Status" },
];

const MainComponent = () => {
  const [activeMaster, setActiveMaster] = useState("batchStatus");

  const renderMasterForm = () => {
    switch (activeMaster) {
      case "user-role":
        return <UserRolesMatser />;
      // case "roles":
      //   return <RolesMaster />;
      // case "plants":
      //   return <PlantsMaster />;
      // case "skus":
      //   return <SkusMaster />;
      case "calibration types":
        return <CalibrationTypeMaster />;
      case "batchStatus":
        return <BatchStatusMaster />;
      default:
        return <div>Select a master from the sidebar</div>;
    }
  };

  return (
    <div className="flex max-h-[70vh] min-h-[80vh]">
      {/* Sidebar */}
      <div className="w-64 bg-green-100 shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Masters</h2>
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

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderMasterForm()}</div>
    </div>
  );
};

export default MainComponent;
