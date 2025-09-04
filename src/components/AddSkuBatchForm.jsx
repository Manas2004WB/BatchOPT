import React, { useEffect, useState } from "react";
import axios from "axios";
import { authHeader } from "../services/authHeader";
import { Toaster, toast } from "sonner";
const API_BASE = "https://localhost:7130/api";

const AddSkuBatchForm = ({ plantId, user, onAddBatch, fetchBatches }) => {
  const [skus, setSkus] = useState([]);
  const [selectedSkuId, setSelectedSkuId] = useState("");
  const [selectedSkuVersionId, setSelectedSkuVersionId] = useState("");
  const [targetDeltaE, setTargetDeltaE] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [batchSize, setBatchSize] = useState("");

  // 🔹 Fetch SKUs for given plant
  useEffect(() => {
    const fetchSkus = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/Sku/GetSkuForGivenPlant/${plantId}`
        );
        setSkus(res.data);
      } catch (err) {
        console.error("Error fetching SKUs:", err);
      }
    };

    fetchSkus();
  }, [plantId]);

  // 🔹 When SKU changes → get latest version + Target ΔE
  useEffect(() => {
    if (!selectedSkuId) {
      setSelectedSkuVersionId("");
      setTargetDeltaE("");
      return;
    }

    const fetchLatestVersionAndTarget = async () => {
      try {
        // 1. Get all versions for selected SKU
        const res = await axios.get(
          `${API_BASE}/Sku/GetSkuVersionsForGivenSku/${selectedSkuId}`
        );
        fetchBatches();
        if (res.data && res.data.length > 0) {
          // 2. Pick the latest version (last one in list)
          const latestVersion = res.data[res.data.length - 1];
          setSelectedSkuVersionId(latestVersion.SkuVersionId);

          // 3. Fetch Target ΔE for that version
          const deltaRes = await axios.get(
            `${API_BASE}/Sku/GetTargetDeltaEBySkuVersion/${latestVersion.SkuVersionId}`
          );

          setTargetDeltaE(deltaRes.data?.TargetDeltaE ?? "");
        }
      } catch (err) {
        console.error("Error fetching latest version or Target ΔE:", err);
        setTargetDeltaE("");
      }
    };

    fetchLatestVersionAndTarget();
  }, [selectedSkuId]);

  const validateForm = () => {
    if (!selectedSkuId) {
      toast.error("Please select an SKU");
      return false;
    }

    if (!batchCode) {
      toast.error("Batch Code is required");
      return false;
    }
    if (!/^[A-Za-z0-9-]+$/.test(batchCode.trim())) {
      toast.error("Batch Code can only contain letters, numbers, and '-'");
      return false;
    }
    if (batchCode.length > 30) {
      toast.error("Batch Code must not exceed 30 characters");
      return false;
    }

    if (!batchSize) {
      toast.error("Batch Size is required");
      return false;
    }
    if (isNaN(batchSize) || batchSize <= 0) {
      toast.error("Batch Size must be a positive number");
      return false;
    }
    if (batchSize >= 1000) {
      toast.error("Batch Size must be less than 1000");
      return false;
    }

    return true;
  };

  // 🔹 Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // ✅ Body matches what backend expects
    const newBatch = {
      SkuId: Number(selectedSkuId), // backend wants SkuId
      BatchCode: batchCode,
      BatchSize: Number(batchSize),
    };

    try {
      const res = await axios.post(`${API_BASE}/Batch`, newBatch, {
        headers: authHeader(),
      });

      // ✅ Find selected sku object to attach its name
      const selectedSku = skus.find((s) => s.SkuId === Number(selectedSkuId));

      const enrichedBatch = {
        ...res.data,
        SkuName: selectedSku?.SkuName || "Unknown",
      };

      onAddBatch(enrichedBatch); // pass enriched batch to parent

      setBatchCode("");
      setBatchSize("");
      setSelectedSkuId("");
      setTargetDeltaE("");
      toast.success("Batch created successfully");
    } catch (err) {
      console.error("Error creating batch:", err);
      toast.error("Failed to create batch");
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <h2 className="text-xl mb-2">Add Batch :</h2>
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-6 border rounded-lg bg-gray-50 shadow-sm"
      >
        {/* Row 1: SKU + Target ΔE */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* SKU Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              SKU
            </label>
            <select
              value={selectedSkuId}
              onChange={(e) => setSelectedSkuId(e.target.value)}
              className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select SKU --</option>
              {skus.map((sku) => (
                <option key={sku.SkuId} value={sku.SkuId}>
                  {sku.SkuName}
                </option>
              ))}
            </select>
          </div>

          {/* Target ΔE */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Target ΔE
            </label>
            <input
              type="number"
              readOnly
              value={targetDeltaE}
              placeholder="Auto-filled"
              className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-800"
              required
            />
          </div>
        </div>

        {/* Row 2: Batch Code + Batch Size */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Batch Code */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Batch Code
            </label>
            <input
              type="text"
              value={batchCode}
              onChange={(e) => setBatchCode(e.target.value)}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Batch Size */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Batch Size
            </label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Add Batch
          </button>
        </div>
      </form>
    </>
  );
};

export default AddSkuBatchForm;
