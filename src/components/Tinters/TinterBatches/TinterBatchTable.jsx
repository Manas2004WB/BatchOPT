import React, { useEffect, useState } from "react";
import { formatUtcToLocal } from "../../../utility/utc2ist";
const TinterBatchTable = ({ tinterId, tinterCode, userId, batches }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      {!batches || batches.length === 0 ? (
        <p className="text-gray-600">No batches found for this tinter.</p>
      ) : (
        <div className="max-h-[300px] overflow-y-auto border border-gray-300 rounded">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#6dc97e] text-white">
              <tr>
                <th className="border px-2 py-1">Batch Code</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Strength</th>
                <th className="border px-2 py-1">Active</th>
                <th className="border px-2 py-1">Updated</th>
                <th className="border px-2 py-1">Panel (L, a, b)</th>
                <th className="border px-2 py-1">Liquid (L, a, b)</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.TinterBatchId} className="hover:bg-emerald-50">
                  <td className="border px-2 py-1">
                    {batch.TinterBatchCode || batch.tinterBatchCode || "-"}
                  </td>
                  <td className="border px-2 py-1">{batch.BatchTinterName}</td>
                  <td className="border px-2 py-1">{batch.Strength}</td>
                  <td className="border px-2 py-1">
                    {batch.IsActive ? "Yes" : "No"}
                  </td>
                  <td className="border px-2 py-1 text-xs text-gray-600">
                    {formatUtcToLocal(batch.UpdatedAt)}
                  </td>
                  <td className="border px-2 py-1">
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
                  <td className="border px-2 py-1">
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
