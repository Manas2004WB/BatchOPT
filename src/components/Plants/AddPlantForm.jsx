import React, { useState } from "react";
import { Toaster, toast } from "sonner";

const AddPlantForm = ({ onAdd }) => {
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
    // only letters, numbers, spaces, and hyphens allowed
    if (!/^(?! )[A-Za-z0-9 -]+(?<! )$/.test(name)) {
      toast.error(
        "Plant name can only contain letters, numbers, spaces, and hyphens (no special symbols)"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // <-- also missing to prevent page reload
    if (!validatePlantName(plant.PlantName)) return;
    onAdd(plant);
    setPlant({ PlantName: "", IsActive: true });
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-xl mb-8 max-w-lg w-full border border-gray-200"
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

      <label className="text-green-800 flex items-center mb-4">
        <input
          type="checkbox"
          checked={plant.IsActive}
          onChange={(e) => setPlant({ ...plant, IsActive: e.target.checked })}
          className="mr-2 accent-green-600"
        />
        Active
      </label>

      <button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded transition-colors"
      >
        Add Plant
      </button>
    </form>
  );
};

export default AddPlantForm;
