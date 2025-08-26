import React, { useEffect, useState } from "react";
import tinterBatchService from "../services/tinterBatchService";

const TinterBatchForm = ({ tinterId, tinterCode, userId }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ New Batch Form State
  const [newBatch, setNewBatch] = useState({
    TinterBatchCode: "",
    BatchTinterName: "",
    Strength: "",
    Comments: "",
    IsActive: true,
    Measurements: {
      panel_l: "",
      panel_a: "",
      panel_b: "",
      liquid_l: "",
      liquid_a: "",
      liquid_b: "",
    },
  });

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

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in newBatch.Measurements) {
      setNewBatch((prev) => ({
        ...prev,
        Measurements: { ...prev.Measurements, [name]: value },
      }));
    } else {
      setNewBatch((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // ✅ Submit new batch
  const handleAddBatch = async (e) => {
    e.preventDefault();
    try {
      const dto = {
        TinterId: tinterId,
        TinterBatchCode: newBatch.TinterBatchCode,
        BatchTinterName: newBatch.BatchTinterName, // <-- ensure this is included
        Strength: parseFloat(newBatch.Strength) || null,
        Comments: newBatch.Comments,
        IsActive: newBatch.IsActive,
        Measurements: Object.entries(newBatch.Measurements).map(
          ([type, value]) => ({
            MeasurementType: type,
            MeasurementValue: value ? parseFloat(value) : null,
          })
        ),
        CreatedBy: userId,
        UpdatedBy: userId,
      };

      const created =
        await tinterBatchService.createTinterBatchWithMeasurements(dto);

      // Add new batch to state
      setBatches((prev) => [...prev, created]);

      // Reset form
      setNewBatch({
        TinterBatchCode: "",
        BatchTinterName: "",
        Strength: "",
        Comments: "",
        IsActive: true,
        Measurements: {
          panel_l: "",
          panel_a: "",
          panel_b: "",
          liquid_l: "",
          liquid_a: "",
          liquid_b: "",
        },
      });
    } catch (err) {
      console.error("Error creating batch:", err);
    }
  };

  if (loading) return <p>Loading batches...</p>;

  return (
    <div className="p-4 bg-white/60 shadow rounded-2xl max-h-[550px]">
      <h2 className="text-xl font-bold mb-4">
        Tinter Batches for {tinterCode}
      </h2>

      {/* ✅ Add Batch Form */}
      <form
        onSubmit={handleAddBatch}
        className="mb-2 flex flex-col gap-4 p-4 border rounded-lg bg-gray-50"
      >
        {/* Top Row */}
        <div className="grid grid-cols-5 gap-4">
          <input
            type="text"
            name="BatchTinterName"
            value={newBatch.BatchTinterName}
            onChange={handleInputChange}
            placeholder="Tinter Name"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="TinterBatchCode"
            value={newBatch.TinterBatchCode}
            onChange={handleInputChange}
            placeholder="Batch Code"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="number"
            step="0.01"
            name="Strength"
            value={newBatch.Strength}
            onChange={handleInputChange}
            placeholder="Strength"
            className="border p-2 rounded w-full"
          />
          <label className="flex items-center justify-center">
            <input
              type="checkbox"
              name="IsActive"
              checked={newBatch.IsActive}
              onChange={handleInputChange}
              className="mr-2"
            />
            Active
          </label>
          <textarea
            name="Comments"
            value={newBatch.Comments}
            onChange={handleInputChange}
            placeholder="Comments"
            className="border p-2 rounded w-full resize-none"
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-3 gap-2">
            {["panel_l", "panel_a", "panel_b"].map((name) => (
              <input
                key={name}
                type="number"
                step="0.01"
                name={name}
                value={newBatch.Measurements[name]}
                onChange={handleInputChange}
                placeholder={`Panel ${name.split("_")[1].toUpperCase()}`}
                className="border p-2 rounded w-full"
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["liquid_l", "liquid_a", "liquid_b"].map((name) => (
              <input
                key={name}
                type="number"
                step="0.01"
                name={name}
                value={newBatch.Measurements[name]}
                onChange={handleInputChange}
                placeholder={`Liquid ${name.split("_")[1].toUpperCase()}`}
                className="border p-2 rounded w-full"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Batch
          </button>
        </div>
      </form>

      {/* ✅ Batch Table */}
      {batches.length === 0 ? (
        <p>No batches found for this tinter.</p>
      ) : (
        <div className="max-h-[200px] overflow-y-auto border border-gray-300 rounded">
          <table className="w-full border-collapse border border-gray-300 ">
            <thead className="sticky top-0 bg-gray-200">
              <tr className="bg-cyan-600 text-white">
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
                                {m?.MeasurementValue ?? "-"}
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
                                {m?.MeasurementValue ?? "-"}
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
                    {new Date(batch.UpdatedAt).toLocaleString()}
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

export default TinterBatchForm;
