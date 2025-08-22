import React, { useEffect, useState } from "react";
import tinterService from "../services/tinterService"; // make sure path is correct

const UpdateTinterForm = ({ tinterToEdit, onUpdate, plantId, user }) => {
  const [tinter, setTinter] = useState({
    TinterCode: "",
    IsActive: true,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (tinterToEdit) {
      setTinter({
        TinterCode: tinterToEdit.TinterCode || "",
        IsActive: tinterToEdit.IsActive ?? true,
      });
    }
  }, [tinterToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = tinter.TinterCode.trim();
    if (!code) return setError("Tinter code is required");
    if (code.length < 2)
      return setError("Tinter code must be at least 2 characters");
    if (code.length > 20)
      return setError("Tinter code must be at most 20 characters");

    try {
      // ✅ API Call here
      const updated = await tinterService.updateTinter(tinterToEdit.TinterId, {
        PlantId: Number(plantId),
        TinterCode: code,
        IsActive: tinter.IsActive,
      });

      // ✅ Add extra frontend fields (not coming from backend)
      const updatedTinter = {
        ...updated,
        updated_by: user?.user_id || "Unknown",
        updated_at: new Date()
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(",", ""),
      };

      onUpdate(updatedTinter); // send back to parent
      setError("");
    } catch (err) {
      console.error("Error updating tinter:", err);
      setError("Failed to update tinter. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-xl mb-8 max-w-lg w-full"
    >
      <h2 className="text-xl font-bold text-black drop-shadow mb-4">
        Edit Tinter
      </h2>

      {error && (
        <p className="text-red-600 bg-red-100 px-2 py-1 rounded mb-4">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Tinter Code"
        value={tinter.TinterCode}
        onChange={(e) => setTinter({ ...tinter, TinterCode: e.target.value })}
        className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <label className="text-black flex items-center mb-4">
        <input
          type="checkbox"
          checked={tinter.IsActive}
          onChange={(e) => setTinter({ ...tinter, IsActive: e.target.checked })}
          className="mr-2"
        />
        Active
      </label>

      <button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded"
      >
        Update Tinter
      </button>
    </form>
  );
};

export default UpdateTinterForm;
