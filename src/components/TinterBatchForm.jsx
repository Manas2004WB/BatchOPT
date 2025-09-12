import React, { useEffect, useState } from "react";
import tinterBatchService from "../services/tinterBatchService";
import { Toaster, toast } from "sonner";
import { formatUtcToLocal } from "../utility/utc2ist";
import TinterBatchTable from "./TinterBatchTable";
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

  // States for random color generation (if needed)
  const randomInRange = (min, max) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  // Ranges for L, a, b (adjust as needed)
  const liquidRanges = { l: [0, 100], a: [-128, 128], b: [-128, 128] };
  const panelRanges = { l: [0, 100], a: [-128, 128], b: [-128, 128] };

  // Fetch random values for Liquid
  // Fetch random values for Liquid
  const fetchRandomLiquid = () => {
    setNewBatch((prev) => ({
      ...prev,
      Measurements: {
        ...prev.Measurements,
        liquid_l: randomInRange(...liquidRanges.l),
        liquid_a: randomInRange(...liquidRanges.a),
        liquid_b: randomInRange(...liquidRanges.b),
      },
    }));
  };

  // Fetch random values for Panel
  const fetchRandomPanel = () => {
    setNewBatch((prev) => ({
      ...prev,
      Measurements: {
        ...prev.Measurements,
        panel_l: randomInRange(...panelRanges.l),
        panel_a: randomInRange(...panelRanges.a),
        panel_b: randomInRange(...panelRanges.b),
      },
    }));
  };

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

  const validateBatch = (batch) => {
    // --- TinterBatchCode ---
    if (!batch.TinterBatchCode.trim()) {
      toast.error("Batch Code is required");
      return false;
    }
    if (batch.TinterBatchCode.length < 3 || batch.TinterBatchCode.length > 30) {
      toast.error("Batch Code must be 3–30 characters long");
      return false;
    }
    if (!/^(?! )[A-Za-z0-9- ]*(?<! )$/.test(batch.TinterBatchCode)) {
      toast.error(
        "Batch Code can only contain letters, numbers, hyphen (-), spaces (not at start/end)"
      );
      return false;
    }

    // --- BatchTinterName ---
    if (!batch.BatchTinterName.trim()) {
      toast.error("Batch Tinter Name is required");
      return false;
    }
    if (batch.BatchTinterName.length < 3 || batch.BatchTinterName.length > 30) {
      toast.error("Batch Tinter Name must be 3–30 characters long");
      return false;
    }
    if (!/^(?! )[A-Za-z0-9 ]*(?<! )$/.test(batch.BatchTinterName)) {
      toast.error(
        "Batch Tinter Name can only contain letters, numbers, and spaces (no leading/trailing spaces)"
      );
      return false;
    }

    // --- Strength ---
    if (!batch.Strength || isNaN(batch.Strength)) {
      toast.error("Strength must be a number");
      return false;
    }
    if (Number(batch.Strength) >= 1000) {
      toast.error("Strength must be less than 1000");
      return false;
    }

    // --- Comments ---
    if (batch.Comments && batch.Comments.length > 500) {
      toast.error("Comments must be less than 500 characters");
      return false;
    }
    return true; // ✅ all validations passed
  };

  // ✅ Submit new batch
  const handleAddBatch = async (e) => {
    e.preventDefault();

    // ✅ validate the raw state, not the DTO
    if (!validateBatch(newBatch)) return;

    try {
      const dto = {
        TinterId: tinterId,
        TinterBatchCode: newBatch.TinterBatchCode,
        BatchTinterName: newBatch.BatchTinterName,
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
      toast.success("Batch created successfully");

      // ✅ Add new batch to state
      setBatches((prev) => {
        const updated = [...prev, created];
        return updated.sort(
          (a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt)
        );
      });

      // ✅ Reset form
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
      toast.error("Error creating batch");
      console.error("Error creating batch:", err);
    }
  };

  if (loading) return <p>Loading batches...</p>;

  return (
    <div className="p-4 bg-white/60 shadow rounded-2xl max-h-[550px] border border-green-100">
      <h2 className="text-xl font-bold text-green-800 mb-4">
        Tinter Batches for {tinterCode}
      </h2>

      {/* ✅ Add Batch Form */}
      <form
        onSubmit={handleAddBatch}
        className="mb-2 flex flex-col gap-4 p-4 border border-green-100 rounded-lg bg-green-50"
      >
        {/* Top Row */}
        <div className="grid grid-cols-6 gap-3">
          <input
            type="text"
            name="TinterBatchCode"
            value={newBatch.TinterBatchCode}
            onChange={handleInputChange}
            placeholder="Batch Code"
            className="col-span-2 border border-gray-300 px-2 py-1 rounded w-full text-sm"
            required
          />
          <input
            type="text"
            name="BatchTinterName"
            value={newBatch.BatchTinterName}
            onChange={handleInputChange}
            placeholder="Tinter Batch Name"
            className="col-span-2 border border-gray-300 px-2 py-1 rounded w-full text-sm"
            required
          />

          <input
            type="number"
            step="0.01"
            name="Strength"
            value={newBatch.Strength}
            onChange={handleInputChange}
            placeholder="Strength"
            className="col-span-1 border border-gray-300 px-2 py-1 rounded w-full text-sm"
          />
          <label className="col-span-1 flex items-center justify-center text-sm text-green-800">
            <input
              type="checkbox"
              name="IsActive"
              checked={newBatch.IsActive}
              onChange={handleInputChange}
              className="mr-1 accent-green-600"
            />
            Active
          </label>
        </div>

        {/* Comments */}
        <textarea
          name="Comments"
          value={newBatch.Comments}
          onChange={handleInputChange}
          placeholder="Comments"
          className="border border-gray-300 px-2 py-1 rounded w-full resize-none text-sm"
        />

        {/* Panel Measurements */}
        <div className="grid grid-cols-4 gap-2 items-center">
          {["panel_l", "panel_a", "panel_b"].map((name) => (
            <input
              key={name}
              type="number"
              step="0.01"
              name={name}
              value={newBatch.Measurements[name]}
              onChange={handleInputChange}
              placeholder={`Panel ${name.split("_")[1].toUpperCase()}`}
              className="border border-gray-300 px-2 py-1 rounded w-full text-sm"
              disabled
            />
          ))}
          <button
            type="button"
            onClick={fetchRandomPanel}
            disabled={!newBatch.TinterBatchCode}
            className={`px-3 py-1 rounded border text-xs font-semibold
            ${
              newBatch.TinterBatchCode.length > 3
                ? "bg-green-200 text-green-800 hover:bg-green-300 border-green-300"
                : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
            }`}
          >
            Fetch
          </button>
        </div>

        {/* Liquid Measurements */}
        <div className="grid grid-cols-4 gap-2 items-center">
          {["liquid_l", "liquid_a", "liquid_b"].map((name) => (
            <input
              key={name}
              type="number"
              step="0.01"
              name={name}
              value={newBatch.Measurements[name]}
              onChange={handleInputChange}
              placeholder={`Liquid ${name.split("_")[1].toUpperCase()}`}
              className="border border-gray-300 px-2 py-1 rounded w-full text-sm"
              disabled
            />
          ))}

          <button
            type="button"
            onClick={fetchRandomLiquid}
            disabled={!newBatch.TinterBatchCode}
            className={`px-3 py-1 rounded border text-xs font-semibold
            ${
              newBatch.TinterBatchCode.length > 3
                ? "bg-green-200 text-green-800 hover:bg-green-300 border-green-300"
                : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
            }`}
          >
            Fetch
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 text-sm"
          >
            Add Batch
          </button>
        </div>
      </form>

      {/* ✅ Batch Table */}
      <TinterBatchTable tinterId={tinterId} batches={batches} />
    </div>
  );
};

export default TinterBatchForm;
