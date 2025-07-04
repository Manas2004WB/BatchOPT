import React, { useState, useEffect } from "react";

const UpdatePlantForm = ({ plant, onUpdate }) => {
  const [updatedPlant, setUpdatedPlant] = useState({ ...plant });
  const [error, setError] = useState("");

  // Keep updated when a new plant is passed
  useEffect(() => {
    setUpdatedPlant(plant);
  }, [plant]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!updatedPlant.plant_name.trim()) {
      return setError("Plant name is required");
    }

    onUpdate(updatedPlant);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Update Plant</h2>

      {error && (
        <p className="text-red-600 bg-red-100 px-3 py-1 mb-4 rounded">
          {error}
        </p>
      )}

      <input
        type="text"
        value={updatedPlant.plant_name}
        onChange={(e) =>
          setUpdatedPlant({ ...updatedPlant, plant_name: e.target.value })
        }
        placeholder="Plant Name"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <label className="flex items-center mb-4 text-gray-700">
        <input
          type="checkbox"
          checked={updatedPlant.is_active}
          onChange={(e) =>
            setUpdatedPlant({ ...updatedPlant, is_active: e.target.checked })
          }
          className="mr-2"
        />
        Active
      </label>

      <button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded"
      >
        Save Changes
      </button>
    </form>
  );
};

export default UpdatePlantForm;
