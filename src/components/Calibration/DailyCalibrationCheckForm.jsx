import React from "react";

const DailyCalibrationCheckForm = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6">
      <div className="flex w-full max-w-4xl items-center gap-x-6">
        <label className="w-1/3 text-lg font-medium text-gray-900 dark:text-white">
          Source
        </label>
        <select className="flex-1 bg-cyan-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5">
          <option value="">White Reference Tile</option>
          <option value="">White Reference Tile 2</option>
          <option value="">White Reference Tile 3</option>
        </select>
      </div>
      <div className="flex w-full max-w-4xl items-center gap-x-6">
        <label className="w-1/3 text-lg font-medium dark:text-white">
          Daily Calibration Values
        </label>
        <div className="flex items-center gap-x-3 ">
          <span className="text-white">L</span>
          <input type="text" className="w-16 p-1 rounded bg-white border" />
          <span className="text-white">A</span>
          <input type="text" className="w-16 p-1 rounded bg-white border" />
          <span className="text-white">B</span>
          <input type="text" className="w-16 p-1 rounded bg-white border" />
          <button className="bg-cyan-700  text-white px-3 py-1 ml-2">
            Fetch
          </button>
        </div>
      </div>
      {/* Comment */}
      <div className="flex w-full max-w-4xl items-center gap-x-6">
        <label className="w-1/3 text-lg font-medium dark:text-white">
          Comment if any
        </label>
        <textarea
          rows={3}
          className="flex-1 bg-white rounded border p-2"
        ></textarea>
      </div>
      <div>
        <button className="bg-cyan-700 px-3 py-1 text-white">Re-Check</button>
      </div>
    </div>
  );
};

export default DailyCalibrationCheckForm;
