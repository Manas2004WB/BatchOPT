import React from "react";
import { calibrationData } from "../../../Data/Calibration/calibrationData";

const DishCleanCheckTable = () => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg max-h-60 overflow-y-auto">
      <table className="min-w-full bg-white/80 text-sm rounded-lg backdrop-blur-md">
        <thead className="bg-cyan-600 text-white sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2 border">Sr. No</th>
            <th className="px-3 py-2 border">Date Time</th>
            <th className="px-3 py-2 border">Dish Clean Values</th>

            <th className="px-3 py-2 border">Comments</th>
          </tr>
        </thead>
        <tbody>
          {calibrationData.map((row, idx) => (
            <tr
              key={row.calibration_id}
              className="border-b hover:bg-cyan-50 transition"
            >
              <td className="px-3 py-2 border text-center">{idx + 1}</td>
              <td className="px-3 py-2 border text-center">
                {row.calibration_datetime
                  ? new Date(row.calibration_datetime).toLocaleString()
                  : "N/A"}
              </td>

              <td className="px-3 py-2 border text-center">
                L: {row.dish_clean_check_l}, a: {row.dish_clean_check_a}, b:{" "}
                {row.dish_clean_check_b}
              </td>
              <td className="px-3 py-2 border">{row.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DishCleanCheckTable;
