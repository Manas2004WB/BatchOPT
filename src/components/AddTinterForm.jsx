import React, { useState } from "react";
import tinterService from "../services/tinterService";

const AddTinterForm = ({ onAdd, plantId }) => {
  console.log("AddTinterForm props - PlantId:", plantId);
  const [tinterCode, setTinterCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = tinterCode.trim();

    // ✅ Validation
    if (!code) return setError("Tinter code is required");
    if (code.length < 2)
      return setError("Tinter code must be at least 2 characters");
    if (code.length > 20)
      return setError("Tinter code must be at most 20 characters");
    if (!/^[a-zA-Z0-9 \-]+$/.test(code)) {
      return setError(
        "Tinter code can only contain letters, numbers, spaces, and hyphens"
      );
    }

    setError("");
    setLoading(true);

    try {
      // ✅ API Call (wrap inside dto)
      const created = await tinterService.createTinter({
        PlantId: Number(plantId),
        TinterCode: tinterCode.trim(),
        IsActive: isActive,
      });

      console.log("Created tinter:", created);

      // ✅ Send created tinter back to parent
      onAdd(created);

      // Reset form
      setTinterCode("");
      setIsActive(true);
    } catch (err) {
      console.error("Error creating tinter:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-xl mb-8 max-w-lg w-full"
    >
      <h2 className="text-xl font-bold text-black drop-shadow mb-4">
        Add New Tinter
      </h2>

      {error && (
        <p className="text-red-600 bg-red-100 px-2 py-1 rounded mb-4">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Tinter Code"
        value={tinterCode}
        onChange={(e) => setTinterCode(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <label className="text-black flex items-center mb-4">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="mr-2"
        />
        Active
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Tinter"}
      </button>
    </form>
  );
};

export default AddTinterForm;
