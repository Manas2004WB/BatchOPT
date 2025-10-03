import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const UpdatePlantForm = ({ plant, onUpdate, onClose }) => {
  const [updatedPlant, setUpdatedPlant] = useState({ ...plant });
  const [error, setError] = useState("");

  useEffect(() => {
    setUpdatedPlant(plant);
  }, [plant]);

  const validatePlantName = (name) => {
    if (!name.trim()) {
      toast.error("Plant name is required");
      return false;
    }
    if (name.length < 3 || name.length > 30) {
      toast.error("Plant name must be between 3 and 30 characters");
      return false;
    }
    if (!/^(?! )[A-Za-z0-9 -]+(?<! )$/.test(name)) {
      toast.error(
        "Plant name can only contain letters, numbers, spaces, and hyphens (no special symbols)"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePlantName(updatedPlant.PlantName)) return;
    onUpdate(updatedPlant);
    setError("");
    if (onClose) onClose(); // close modal after saving
  };

  const handleDiscard = () => {
    setUpdatedPlant({ ...plant }); // reset to original
    setError("");
    if (onClose) onClose(); // just close modal
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200 w-full max-w-md"
    >
      <h2 className="text-xl font-bold text-green-800 mb-4">Update Plant</h2>

      {error && (
        <p className="text-red-600 bg-red-100 px-3 py-1 mb-4 rounded border border-red-300">
          {error}
        </p>
      )}

      <input
        type="text"
        value={updatedPlant.PlantName}
        onChange={(e) =>
          setUpdatedPlant({ ...updatedPlant, PlantName: e.target.value })
        }
        placeholder="Plant Name"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <label className="flex items-center mb-6 text-green-800">
        <input
          type="checkbox"
          checked={updatedPlant.IsActive}
          onChange={(e) =>
            setUpdatedPlant({ ...updatedPlant, IsActive: e.target.checked })
          }
          className="mr-2 accent-green-600"
        />
        Active
      </label>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleDiscard}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium transition-colors"
        >
          Discard
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-semibold rounded transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default UpdatePlantForm;
