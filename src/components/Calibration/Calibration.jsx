import React, { useState } from "react";
import { calibrationType } from "../../Data/Calibration/CalibrationType";
import CalibrationForm from "./CalibrationForm";
import DailyCalibrationCheckForm from "./DailyCalibrationCheckForm";
import DishCleanCheckForm from "./DishCleanCheckForm";
import { calibrationData } from "../../Data/Calibration/calibrationData";
import CalibrationTable from "./Tables/CalibrationTable";
import DailyCalibrationTable from "./Tables/DailyCalibrationTable";
import DishCleanCheckTable from "./Tables/DishCleanCheckTable";

const Calibration = () => {
  const [selectedType, setSelectedType] = useState("Calibration");

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6 p-6">
      {/* Calibration Type Row */}
      <div className="flex w-full max-w-4xl items-center h-0 gap-x-6">
        <label className="w-1/3 text-lg font-medium text-gray-900 dark:text-white">
          Calibration Type
        </label>
        <select
          className="flex-1 bg-cyan-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {calibrationType.map((type) => (
            <option
              key={type.calibration_type_id}
              value={type.calibration_type_name}
            >
              {type.calibration_type_name}
            </option>
          ))}
        </select>
      </div>

      {/* Conditional Form Display */}
      <div className="w-full max-w-4xl">
        {selectedType === "Calibration" ? (
          <CalibrationForm />
        ) : selectedType === "Daily Calibration check" ? (
          <DailyCalibrationCheckForm />
        ) : (
          <DishCleanCheckForm />
        )}
      </div>

      <div className="w-full max-w-4xl">
        {selectedType === "Calibration" ? (
          <CalibrationTable />
        ) : selectedType === "Daily Calibration check" ? (
          <DailyCalibrationTable />
        ) : (
          <DishCleanCheckTable />
        )}
      </div>
    </div>
  );
};

export default Calibration;
