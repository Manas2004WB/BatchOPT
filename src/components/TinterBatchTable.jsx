import React, { useEffect, useState } from "react";
import tinterBatchService from "../services/tinterBatchService";
import { Toaster, toast } from "sonner";
import { formatUtcToLocal } from "../utility/utc2ist";
const TinterBatchTable = ({ tinterId, tinterCode, userId, batches }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div>
      {!batches || batches.length === 0 ? (
        <p className="text-gray-600">No batches found for this tinter.</p>
      ) : (
        <div className="max-h-[200px] overflow-y-auto border border-green-100 rounded">
          <table className="w-full border-collapse border border-green-100">
            <thead className="sticky top-0 bg-green-800 text-white">
              <tr>
                <th className="border p-2">Batch Code</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Panel (L, a, b)</th>
                <th className="border p-2">Liquid (L, a, b)</th>
                <th className="border p-2">Strength</th>
                <th className="border p-2">Active</th>
                <th className="border p-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.TinterBatchId} className="hover:bg-green-50">
                  <td className="border p-2">
                    {batch.TinterBatchCode || batch.tinterBatchCode || "-"}
                  </td>
                  <td className="border p-2">{batch.BatchTinterName}</td>
                  {/* Panel */}
                  <td className="border p-2">
                    <table className="w-full text-center border border-gray-200 rounded">
                      <tbody>
                        <tr>
                          {["panel_l", "panel_a", "panel_b"].map((type) => {
                            const m = batch.Measurements?.find(
                              (m) => m.MeasurementType === type
                            );
                            return (
                              <td
                                key={`${batch.TinterBatchId}-${type}`}
                                className="px-2 py-1 border"
                              >
                                {parseFloat(m?.MeasurementValue).toFixed(2) ??
                                  "-"}
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  {/* Liquid */}
                  <td className="border p-2">
                    <table className="w-full text-center border border-gray-200 rounded">
                      <tbody>
                        <tr>
                          {["liquid_l", "liquid_a", "liquid_b"].map((type) => {
                            const m = batch.Measurements?.find(
                              (m) => m.MeasurementType === type
                            );
                            return (
                              <td
                                key={`${batch.TinterBatchId}-${type}`}
                                className="px-2 py-1 border"
                              >
                                {parseFloat(m?.MeasurementValue).toFixed(2) ??
                                  "-"}
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  <td className="border p-2">{batch.Strength}</td>
                  <td className="border p-2">
                    {batch.IsActive ? "Yes" : "No"}
                  </td>
                  <td className="border p-2 text-xs text-gray-500">
                    {formatUtcToLocal(batch.UpdatedAt)}
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
