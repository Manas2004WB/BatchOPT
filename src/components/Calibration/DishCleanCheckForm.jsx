import React, { useState } from "react";

const DishCleanCheckForm = ({ onSave, calibrationList }) => {
  const [entryValues, setEntryValues] = useState({
    dateTime: "",
    lValue: "",
    aValue: "",
    bValue: "",
    comments: "",
  });
  const handleEntrySave = () => {
    console.log("Saving entry:", entryValues);
    const newObj = {
      calibration_id: calibrationList.length + 1, // Example ID generation
      sensor_id: "-",
      calibration_source_used: "-",
      calibration_datetime: new Date().toISOString(),
      absolute_calibration_l: "-",
      absolute_calibration_a: "-",
      absolute_calibration_b: "-",
      daily_calibration_l: "-",
      daily_calibration_a: "-",
      daily_calibration_b: "-",
      dc_source: "-",
      auto_modulation: "-",
      readjustment: "-",
      delta_e: "-",
      calibration_type_id: 3, // Assuming Dish Clean Check has ID 3
      white_reference: "-",
      auto_modulation_status: "-",
      white_reference_status: "-",
      comments: entryValues.comments,
      dish_clean_check_l: entryValues.lValue,
      dish_clean_check_a: entryValues.aValue,
      dish_clean_check_b: entryValues.bValue,
      dish_clean_check_source: "-",
    };
    onSave(newObj);
    setEntryValues({
      dateTime: "",
      lValue: "",
      aValue: "",
      bValue: "",
      comments: "",
    });
  };
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[30px] space-y-2">
      {/* Calibration Source */}
      <div className="flex w-full max-w-4xl items-center gap-x-6">
        <label className="w-1/3 text-lg font-medium text-gray-900 dark:text-white">
          Calibration Source Used
        </label>
        <select className="flex-1 bg-cyan-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5">
          <option value="">Card 1</option>
          <option value="">Card 2</option>
          <option value="">Card 3</option>
        </select>
      </div>

      {/* Dish Clean Check Values */}
      <div className="flex w-full max-w-4xl items-center gap-x-6">
        <label className="w-1/3 text-lg font-medium dark:text-white">
          Dish Clean Check Values
        </label>
        <div className="flex items-center gap-x-3 ">
          <span className="text-white">L</span>
          <input
            type="number"
            value={entryValues.lValue}
            onChange={(e) =>
              setEntryValues({ ...entryValues, lValue: e.target.value })
            }
            className="w-16 p-1 rounded bg-white border"
          />
          <span className="text-white">A</span>
          <input
            type="number"
            value={entryValues.aValue}
            onChange={(e) =>
              setEntryValues({ ...entryValues, aValue: e.target.value })
            }
            className="w-16 p-1 rounded bg-white border"
          />
          <span className="text-white">B</span>
          <input
            type="number"
            value={entryValues.bValue}
            onChange={(e) =>
              setEntryValues({ ...entryValues, bValue: e.target.value })
            }
            className="w-16 p-1 rounded bg-white border"
          />
          <button className="bg-cyan-700 rounded-lg text-white px-3 py-1 ml-2">
            Check
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
          value={entryValues.comments}
          onChange={(e) =>
            setEntryValues({ ...entryValues, comments: e.target.value })
          }
          className="flex-1 bg-white rounded border p-2"
        ></textarea>
      </div>
      <div className="flex w-full max-w-4xl items-center gap-x-6 justify-center">
        <button
          onClick={handleEntrySave}
          disabled={
            !entryValues.lValue || !entryValues.aValue || !entryValues.bValue
          }
          className="bg-cyan-700 rounded-lg text-white px-3 py-1 ml-2"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DishCleanCheckForm;
