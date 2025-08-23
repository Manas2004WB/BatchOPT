import React, { useEffect, useState } from "react";
import tinterBatchService from "../services/tinterBatchService";
const TinterBatchForm = ({ tinterId, tinterCode, userId }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch batches whenever tinterId changes
  useEffect(() => {
    if (!tinterId) return;
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const data = await tinterBatchService.getTinterBatchesWithMeasurements(
          tinterId
        );
        setBatches(data);
      } catch (err) {
        console.error("Error fetching tinter batches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, [tinterId]);

  if (loading) return <p>Loading batches...</p>;

  return (
    <div className="p-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-bold mb-4">
        Tinter Batches for {tinterCode}
      </h2>

      {batches.length === 0 ? (
        <p>No batches found for this tinter.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
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
              <tr key={batch.TinterBatchId}>
                <td className="border p-2">{batch.TinterBatchCode}</td>
                <td className="border p-2">{batch.BatchTinterName}</td>
                {/* Panel (L, a, b) nested table */}
                <td className="border p-2">
                  <table className="w-full text-center border border-gray-200 rounded">
                    <tbody>
                      <tr>
                        {["panel_l", "panel_a", "panel_b"].map((type) => {
                          const m = batch.Measurements?.find(
                            (m) => m.MeasurementType === type
                          );
                          return (
                            <td key={type} className="px-2 py-1 border">
                              {m?.MeasurementValue ?? "-"}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </td>
                {/* Liquid (L, a, b) nested table */}
                <td className="border p-2">
                  <table className="w-full text-center border border-gray-200 rounded">
                    <tbody>
                      <tr>
                        {["liquid_l", "liquid_a", "liquid_b"].map((type) => {
                          const m = batch.Measurements?.find(
                            (m) => m.MeasurementType === type
                          );
                          return (
                            <td key={type} className="px-2 py-1 border">
                              {m?.MeasurementValue ?? "-"}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td className="border p-2">{batch.Strength}</td>
                <td className="border p-2">{batch.IsActive ? "Yes" : "No"}</td>
                <td className="border p-2 text-xs text-gray-500">
                  {batch.UpdatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TinterBatchForm;
