import React, { useState, useEffect } from "react";

const UpdatePlantForm = ({ plant, onUpdate }) => {
  const [updatedPlant, setUpdatedPlant] = useState({ ...plant });
  const [error, setError] = useState("");

  useEffect(() => {
    setUpdatedPlant(plant);
  }, [plant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = updatedPlant.PlantName.trim();
    if (!name) {
      return setError("Plant name is required");
    }
    if (name.length < 3) {
      return setError("Plant name must be at least 3 characters");
    }
    if (name.length > 30) {
      return setError("Plant name must be at most 30 characters");
    }

    onUpdate(updatedPlant);
    setError("");
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
        value={updatedPlant.PlantName}
        onChange={(e) =>
          setUpdatedPlant({ ...updatedPlant, PlantName: e.target.value })
        }
        placeholder="Plant Name"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <label className="flex items-center mb-4 text-gray-700">
        <input
          type="checkbox"
          checked={updatedPlant.IsActive}
          onChange={(e) =>
            setUpdatedPlant({ ...updatedPlant, IsActive: e.target.checked })
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
