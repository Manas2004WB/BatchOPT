import React, { useState } from "react";

const AddPlantForm = ({ onAdd }) => {
  const [plant, setPlant] = useState({
    plant_name: "",
    is_active: true,
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = plant.plant_name.trim();
    if (!name) {
      return setError("Plant name is required");
    }
    if (name.length < 3) {
      return setError("Plant name must be at least 3 characters");
    }
    if (name.length > 30) {
      return setError("Plant name must be at most 30 characters");
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(name)) {
      return setError(
        "Plant name can only contain letters, numbers, and spaces"
      );
    }

    onAdd(plant);
    setPlant({ plant_name: "", is_active: true });
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-xl mb-8 max-w-lg w-full"
    >
      <h2 className="text-xl font-bold text-black drop-shadow mb-4">
        Add New Plant
      </h2>

      {error && (
        <p className="text-red-600 bg-red-100 px-2 py-1 rounded mb-4">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Plant Name"
        value={plant.plant_name}
        onChange={(e) => setPlant({ ...plant, plant_name: e.target.value })}
        className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <label className="text-black flex items-center mb-4">
        <input
          type="checkbox"
          checked={plant.is_active}
          onChange={(e) => setPlant({ ...plant, is_active: e.target.checked })}
          className="mr-2"
        />
        Active
      </label>

      <button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded"
      >
        Add Plant
      </button>
    </form>
  );
};

export default AddPlantForm;
