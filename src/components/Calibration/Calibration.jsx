import React, { useState, useEffect } from "react";
import CalibrationForm from "./CalibrationForm";
import DailyCalibrationCheckForm from "./DailyCalibrationCheckForm";
import DishCleanCheckForm from "./DishCleanCheckForm";
import { calibrationData } from "../../Data/Calibration/calibrationData";
import CalibrationTable from "./Tables/CalibrationTable";
import DailyCalibrationTable from "./Tables/DailyCalibrationTable";
import DishCleanCheckTable from "./Tables/DishCleanCheckTable";
import calibrationTypeService from "../../services/calibrationTypeService";

const Calibration = ({ plantId }) => {
  const [selectedType, setSelectedType] = useState("Calibration");
  const [calibrationTypes, setCalibrationTypes] = useState([]);
  const [calibrationList, setCalibrationList] = useState(calibrationData);
  const [loading, setLoading] = useState(false);
  const onSave = (newData) => {
    setCalibrationList((prevList) => [...prevList, newData]);
  };
  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const data = await calibrationTypeService.getCalibrationTypes();
      setCalibrationTypes(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center  min-h-[70vh] justify-center w-full space-y-6 p-1 pt-12 bg-emerald-50/50">
      {/* Calibration Type Row */}
      <div className="flex w-full max-w-4xl items-center h-0 gap-x-6">
        <label className="w-1/3 text-lg font-medium text-[#3dcd58] ">
          Calibration Type
        </label>
        <select
          className="flex-1 bg-emerald-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 p-2.5"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {calibrationTypes.map((type) => (
            <option
              key={type.CalibrationTypeId}
              value={type.CalibrationTypeName}
            >
              {type.CalibrationTypeName}
            </option>
          ))}
        </select>
      </div>

      {/* Conditional Form Display */}
      <div className="w-full max-w-4xl max-h-[70vh]">
        {selectedType === "Calibration" ? (
          <CalibrationForm onSave={onSave} calibrationList={calibrationList} />
        ) : selectedType === "Daily Calibration Check" ? (
          <DailyCalibrationCheckForm
            onSave={onSave}
            calibrationList={calibrationList}
          />
        ) : (
          <DishCleanCheckForm
            onSave={onSave}
            calibrationList={calibrationList}
          />
        )}
      </div>

      <div className="w-full max-w-4xl">
        {selectedType === "Calibration" ? (
          <CalibrationTable calibrationList={calibrationList} />
        ) : selectedType === "Daily Calibration check" ? (
          <DailyCalibrationTable calibrationList={calibrationList} />
        ) : (
          <DishCleanCheckTable calibrationList={calibrationList} />
        )}
      </div>
    </div>
  );
};

export default Calibration;
