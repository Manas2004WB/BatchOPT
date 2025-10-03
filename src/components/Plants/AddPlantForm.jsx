import React, { useState } from "react";
import { Toaster, toast } from "sonner";

const AddPlantForm = ({ onAdd, onClose }) => {
  const [plant, setPlant] = useState({
    PlantName: "",
    IsActive: true,
  });
  const [error, setError] = useState("");

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
    if (!validatePlantName(plant.PlantName)) return;
    onAdd(plant);
    setPlant({ PlantName: "", IsActive: true });
    setError("");
    if (onClose) onClose(); // close popup after save
  };

  const handleDiscard = () => {
    setPlant({ PlantName: "", IsActive: true });
    setError("");
    if (onClose) onClose(); // just close popup
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
    >
      <h2 className="text-xl font-bold text-green-800 mb-4">Add New Plant</h2>

      {error && (
        <p className="text-red-600 bg-red-100 px-2 py-1 rounded mb-4 border border-red-300">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Plant Name"
        value={plant.PlantName}
        onChange={(e) => setPlant({ ...plant, PlantName: e.target.value })}
        className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <label className="text-green-800 flex items-center mb-6">
        <input
          type="checkbox"
          checked={plant.IsActive}
          onChange={(e) => setPlant({ ...plant, IsActive: e.target.checked })}
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

export default AddPlantForm;
