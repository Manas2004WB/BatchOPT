import React, { useState } from "react";
import { formatUtcToLocal } from "../../../utility/utc2ist";

const TinterBatchTable = ({ batches }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="">
      {!batches || batches.length === 0 ? (
        <p className="text-gray-600">No batches found for this tinter.</p>
      ) : (
        <div className="max-h-[300px] overflow-y-auto border border-gray-300 ">
          <table className="w-full text-sm text-left border-collapse border border-gray-300">
            <thead className="bg-green-200/75 text-gray-800">
              <tr>
                <th className="border border-gray-300 px-2 py-1">Batch Code</th>
                <th className="border border-gray-300 px-2 py-1">Name</th>
                <th className="border border-gray-300 px-2 py-1">Strength</th>
                <th className="border border-gray-300 px-2 py-1">Active</th>
                <th className="border border-gray-300 px-2 py-1">Updated</th>
                <th className="border border-gray-300 px-2 py-1">
                  Panel (L, a, b)
                </th>
                <th className="border border-gray-300 px-2 py-1">
                  Liquid (L, a, b)
                </th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.TinterBatchId} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-2 py-1">
                    {batch.TinterBatchCode || batch.tinterBatchCode || "-"}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {batch.BatchTinterName}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {batch.Strength}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {batch.IsActive ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-xs text-gray-600">
                    {formatUtcToLocal(batch.UpdatedAt)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {["panel_l", "panel_a", "panel_b"].map((type) => {
                      const m = batch.Measurements?.find(
                        (m) => m.MeasurementType === type
                      );
                      return (
                        <span
                          key={`${batch.TinterBatchId}-${type}`}
                          className="px-1"
                        >
                          {m && m.MeasurementValue !== undefined
                            ? parseFloat(m.MeasurementValue).toFixed(2)
                            : "-"}
                        </span>
                      );
                    })}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    {["liquid_l", "liquid_a", "liquid_b"].map((type) => {
                      const m = batch.Measurements?.find(
                        (m) => m.MeasurementType === type
                      );
                      return (
                        <span
                          key={`${batch.TinterBatchId}-${type}`}
                          className="px-1"
                        >
                          {m && m.MeasurementValue !== undefined
                            ? parseFloat(m.MeasurementValue).toFixed(2)
                            : "-"}
                        </span>
                      );
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TinterBatchTable;
