import React from "react";

const CalibrationForm = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6">
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
      <div className="flex flex-col w-full max-w-4xl space-y-3 bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center flex-row">
          <span className="text-lg font-medium text-black">
            Auto Modulation
          </span>
          <button className="bg-cyan-600 text-white px-3 py-1  hover:bg-cyan-700 transition">
            Begin
          </button>
          <div className="flex justify-between text-black">
            <span>Status:</span>
            <strong>Not Done</strong>
          </div>
          <div className="flex items-center gap-x-2 text-black">
            <input type="radio" />
            <span>Re-adjustment of measuring distance</span>
          </div>
        </div>
      </div>

      {/* White Referencing Section */}
      <div className="flex flex-col w-full max-w-4xl space-y-3 bg-white p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-black">
            White Referencing
          </span>
          <button className="bg-cyan-600 text-white px-3 py-1  hover:bg-cyan-700 transition">
            Begin
          </button>
          <div className="flex justify-between text-black">
            <span>Status :</span>
            <span> Not Done</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalibrationForm;
