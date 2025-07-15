import React, { useState } from "react";
import { skuVersionMeasurements } from "../Data/SkuMeasurementData";

const AddSkuBatchForm = ({
  user,
  plantId,
  onAddBatch,
  skuData,
  skuVersions,
}) => {
  const [selectedSkuId, setSelectedSkuId] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [batchSize, setBatchSize] = useState("");
  const [error, setError] = useState("");

  // Find active SKUs for the current plant
  const activeSkus = skuData.filter(
    (sku) => sku.is_active && sku.plant_id === Number(plantId)
  );

  const latestVersion = skuVersions
    .filter((v) => v.sku_id === parseInt(selectedSkuId) && v.is_active)
    .sort((a, b) => b.sku_version_id - a.sku_version_id)[0];

  const targetDeltaE = skuVersionMeasurements.find(
    (m) =>
      m.sku_version_id === latestVersion?.sku_version_id &&
      m.measurement_type === "target_delta_e"
  )?.measurement_value;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSkuId || !batchCode.trim() || !defaultVersion) {
      setError("Please select a valid SKU and fill all fields.");
      return;
    }

    const now = new Date().toISOString();

    const newBatch = {
      batch_id: Date.now(),
      sku_version_id: latestVersion?.sku_version_id,
      batch_code: batchCode,
      batch_size: parseFloat(batchSize),
      batch_status_id: 1, // static
      created_at: now,
      updated_at: now,
      created_by: user?.user_id ?? 1,
      updated_by: user?.user_id ?? 1,
    };

    if (onAddBatch) onAddBatch(newBatch);

    // Reset form
    setError("");
    setSelectedSkuId("");
    setBatchCode("");
    setBatchSize("");
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold text-black">Add SKU Batch</h2>

        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          {/* SKU Dropdown */}
          <div>
            <label className="block mb-1 text-gray-700">SKU</label>
            <select
              value={selectedSkuId}
              onChange={(e) => setSelectedSkuId(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Select SKU</option>
              {activeSkus.map((sku) => (
                <option key={sku.sku_id} value={sku.sku_id}>
                  {sku.sku_name}
                </option>
              ))}
            </select>
          </div>

          {/* Target ΔE (auto-filled) */}
          <div>
            <label className="block mb-1 text-gray-700">Target ΔE</label>
            <input
              type="number"
              readOnly
              value={targetDeltaE ?? ""}
              placeholder="Auto-filled"
              className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-800"
            />
          </div>

          {/* Batch Code */}
          <div>
            <label className="block mb-1 text-gray-700">Batch Code</label>
            <input
              type="text"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter batch code"
            />
          </div>

          {/* Batch Size */}
          <div>
            <label className="block mb-1 text-gray-700">Batch Size</label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter batch size"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-cyan-600 text-white px-6 py-2 rounded hover:bg-cyan-700 transition"
          >
            Add Batch
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSkuBatchForm;
