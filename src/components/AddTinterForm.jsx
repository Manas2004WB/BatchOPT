import React, { useState } from "react";
import tinterService from "../services/tinterService";
import { Toaster, toast } from "sonner";

const AddTinterForm = ({ onAdd, plantId }) => {
  console.log("AddTinterForm props - PlantId:", plantId);
  const [tinterCode, setTinterCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!tinterCode.trim()) {
      toast.error("Tinter code is required");
      return false;
    }
    if (tinterCode.length < 2 || tinterCode.length > 20) {
      toast.error("Tinter code must be in range 2-20 characters");
      return false;
    }
    if (!/^(?! )[A-Za-z0-9- ]*(?<! )$/.test(tinterCode)) {
      toast.error(
        "Tinter Code can contain letters, numbers, '-', spaces (but not at start/end)"
      );
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const code = tinterCode.trim();
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
      className="bg-white p-6 rounded-xl shadow-xl mb-8 max-w-lg w-full border border-green-100"
    >
      <h2 className="text-xl font-bold text-green-800 mb-4">Add New Tinter</h2>

      <input
        type="text"
        placeholder="Tinter Code"
        value={tinterCode}
        onChange={(e) => setTinterCode(e.target.value)}
        className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <label className="text-green-800 flex items-center mb-4">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="mr-2 accent-green-600"
        />
        Active
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded disabled:opacity-50 transition-colors"
      >
        {loading ? "Adding..." : "Add Tinter"}
      </button>
    </form>
  );
};

export default AddTinterForm;
