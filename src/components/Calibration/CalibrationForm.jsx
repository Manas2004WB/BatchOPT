import React, { useState } from "react";

const CalibrationForm = ({ onSave, calibrationList }) => {
  const [autoModStarted, setAutoModStarted] = useState(false);
  const [readjustment, setReadjustment] = useState(false);
  const [autoModStatus, setAutoModStatus] = useState("Not Done");
  const handleAutoModBegin = () => {
    setAutoModStarted(true);
    setAutoModStatus("Done");
  };
  const handleEntrySave = () => {
    // Helper to generate random float < 100 with 2 decimals
    const randomFloat = (max = 100) => (Math.random() * max).toFixed(2);
    // Helper to generate random float between -5 and 5 for a/b
    const randomAB = () => (Math.random() * 10 - 5).toFixed(2);
    const now = new Date();
    const newObj = {
      calibration_id: calibrationList.length + 1, // Example ID generation
      sensor_id: "-",
      calibration_source_used: "-",
      calibration_datetime: now.toISOString(),
      absolute_calibration_l: randomFloat(),
      absolute_calibration_a: randomAB(),
      absolute_calibration_b: randomAB(),
      daily_calibration_l: "-",
      daily_calibration_a: "-",
      daily_calibration_b: "-",
      dc_source: "-",
      auto_modulation: autoModStatus,
      readjustment: readjustment ? "Done" : "Not-Done",
      delta_e: "-",
      calibration_type_id: 2, // Assuming Daily Calibration Check has ID 2
      white_reference: now.toLocaleString() || "",
      auto_modulation_status: autoModStatus,
      white_reference_status: "Done",
      comments: "-",
      dish_clean_check_l: "-",
      dish_clean_check_a: "-",
      dish_clean_check_b: "-",
      dish_clean_check_source: "-",
    };
    if (onSave) onSave(newObj);
    setAutoModStarted(false);
    setAutoModStatus("Not Done");
    setReadjustment(false);
  };
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[30px] space-y-2">
      {/* Calibration Source Used */}
      <div className="flex w-full max-w-4xl items-center gap-x-6">
        <label className="w-1/3 text-lg font-medium text-gray-900 dark:text-white">
          Calibration Source Used
        </label>
        <select className="flex-1 bg-cyan-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5">
          <option value="">White Reference Tile</option>
          <option value="">White Reference Tile 2</option>
          <option value="">White Reference Tile 3</option>
        </select>
      </div>

      {/* Auto Modulation Section */}
      <div className="flex justify-between w-full max-w-4xl items-center gap-x-6 bg-white p-4 rounded-lg">
        <span className="text-lg font-medium text-black">Auto Modulation</span>
        <button
          className={`bg-cyan-600 text-white px-3 py-1 hover:bg-cyan-700 transition ${
            autoModStarted ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleAutoModBegin}
          disabled={autoModStarted}
        >
          Begin
        </button>
        {autoModStarted && (
          <div className="flex items-center gap-x-2 text-black">
            <input
              type="checkbox"
              checked={readjustment}
              onChange={(e) => setReadjustment(e.target.checked)}
              id="readjustment"
            />
            <label htmlFor="readjustment">
              Re-adjustment of measuring distance
            </label>
          </div>
        )}
        <div className="flex items-center gap-x-2 text-black">
          <span>Status:</span>
          <strong>{autoModStatus}</strong>
        </div>
      </div>

      {/* White Referencing Section */}
      <div className="flex flex-col w-full max-w-4xl space-y-3 bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-black">
            White Referencing
          </span>
          <button
            onClick={handleEntrySave}
            className="bg-cyan-600 text-white px-3 py-1  hover:bg-cyan-700 transition"
          >
            Begin
          </button>
          <div className="flex justify-between text-black">
            <span>Status :</span>
            <span> Not Done</span>
          </div>
          <div className="flex justify-between text-black"></div>
          <div className="flex justify-between text-black"></div>
        </div>
      </div>
    </div>
  );
};

export default CalibrationForm;
