import React, { useState, useEffect } from "react";
import { tinters } from "../Data/TinterData";
import { tinterBatches } from "../Data/TinterBatches";
import { ImCancelCircle } from "react-icons/im";
// Add a prop: plantId
const TinterSelectionModal = ({
  user,
  isOpen,
  onClose,
  onSave,
  preselectedTinters = [],
  allowedTinterIds,
  plantId, // new prop for plant
}) => {
  const [selectedTinters, setSelectedTinters] = useState([]);
  const [batchOptions, setBatchOptions] = useState({});

  useEffect(() => {
    const allActiveTinters = tinters.filter((t) => t.is_active);
    const plantTinters = allActiveTinters.filter(
      (t) => t.plant_id === Number(plantId)
    );
    console.log("🌱 All active tinters for plant:", plantTinters);

    // Default tinters to preselected or first 2 allowed ones
    let defaultTinters = preselectedTinters.length
      ? preselectedTinters
      : plantTinters
          .filter((t) => allowedTinterIds.includes(t.tinter_id))
          .slice(0, 2)
          .map((t) => ({
            tinter_id: t.tinter_id,
            batch_id: null,
          }));

    console.log("🌟 Default selected tinters:", defaultTinters);

    setSelectedTinters(defaultTinters);

    // Get batches for all plant tinters
    const batchesByTinter = {};
    plantTinters.forEach((tinter) => {
      batchesByTinter[tinter.tinter_id] = tinterBatches
        ? tinterBatches.filter(
            (b) => b.tinter_id === tinter.tinter_id && b.is_active
          )
        : [];
    });
    setBatchOptions(batchesByTinter);
  }, [preselectedTinters, allowedTinterIds, plantId]);

  const handleTinterChange = (index, tinterId) => {
    const updated = [...selectedTinters];
    updated[index].tinter_id = parseInt(tinterId);
    updated[index].batch_id = null; // Reset batch
    setSelectedTinters(updated);
  };

  const handleBatchChange = (index, batchId) => {
    const updated = [...selectedTinters];
    updated[index].batch_id = parseInt(batchId);
    setSelectedTinters(updated);
  };

  const addTinter = () => {
    setSelectedTinters([
      ...selectedTinters,
      { tinter_id: null, batch_id: null },
    ]);
  };

  const removeTinter = (index) => {
    if (selectedTinters.length > 0) {
      const updated = selectedTinters.filter((_, i) => i !== index);
      setSelectedTinters(updated);
    }
  };

  const handleSave = () => {
    const isValid = selectedTinters.every((t) => t.tinter_id && t.batch_id);
    if (!isValid) {
      alert("Please select both Tinter and Batch for all entries.");
      return;
    }
    onSave(selectedTinters);
    onClose();
  };

  if (!isOpen) return null;

  // Only show allowed tinters in dropdown
  let dropdownTinters = tinters.filter(
    (t) => t.is_active && t.plant_id === Number(plantId)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Select Tinters and Batches</h2>
          <button onClick={onClose} className="text-red-600 font-bold">
            <ImCancelCircle />
          </button>
        </div>

        {selectedTinters.map((entry, index) => (
          <div key={index} className="flex gap-4 items-center mb-4">
            <select
              value={entry.tinter_id || ""}
              onChange={(e) => handleTinterChange(index, e.target.value)}
              className="border p-2 rounded w-1/2"
            >
              <option value="">Select Tinter</option>
              {dropdownTinters.map((tinter) => (
                <option key={tinter.tinter_id} value={tinter.tinter_id}>
                  {tinter.tinter_code}
                </option>
              ))}
            </select>

            <select
              value={entry.batch_id || ""}
              onChange={(e) => handleBatchChange(index, e.target.value)}
              disabled={!entry.tinter_id}
              className="border p-2 rounded w-1/2"
            >
              <option value="">Select Batch</option>
              {(batchOptions[entry.tinter_id] || []).map((batch) => (
                <option
                  key={batch.tinter_batch_id}
                  value={batch.tinter_batch_id}
                >
                  {batch.tinter_batch_code} - {batch.batch_tinter_name}
                </option>
              ))}
            </select>

            {index >= 0 && (
              <button
                onClick={() => removeTinter(index)}
                className="text-red-600 font-bold text-lg"
              >
                −
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addTinter}
          className="text-blue-600 underline mb-4 text-sm"
        >
          + Add Tinter
        </button>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Selection
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TinterSelectionModal;
