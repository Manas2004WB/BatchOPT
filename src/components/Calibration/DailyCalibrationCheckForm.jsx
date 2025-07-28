import React from "react";

const DailyCalibrationCheckForm = ({ calibrationList, onSave }) => {
  const [entryValues, setEntryValues] = React.useState({
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
      daily_calibration_l: entryValues.lValue,
      daily_calibration_a: entryValues.aValue,
      daily_calibration_b: entryValues.bValue,
      dc_source: "-",
      auto_modulation: "-",
      readjustment: "-",
      delta_e: "-",
      calibration_type_id: 2, // Assuming Daily Calibration Check has ID 2
      white_reference: "-",
      auto_modulation_status: "-",
      white_reference_status: "-",
      comments: entryValues.comments,
      dish_clean_check_l: "-",
      dish_clean_check_a: "-",
      dish_clean_check_b: "-",
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
          value={entryValues.comments}
          onChange={(e) =>
            setEntryValues({ ...entryValues, comments: e.target.value })
          }
          className="flex-1 bg-white rounded border p-2"
        ></textarea>
      </div>
      <div>
        <button
          disabled={
            !entryValues.lValue || !entryValues.aValue || !entryValues.bValue
          }
          onClick={handleEntrySave}
          className="bg-cyan-700 px-3 py-1 text-white"
        >
          Re-Check
        </button>
      </div>
    </div>
  );
};

export default DailyCalibrationCheckForm;
