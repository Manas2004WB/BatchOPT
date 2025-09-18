import React, { useEffect, useState } from "react";
import tinterService from "../../services/tinterService";
import { toast } from "sonner";

const UpdateTinterForm = ({ tinterToEdit, onUpdate, plantId, user }) => {
  const [tinter, setTinter] = useState({
    TinterCode: "",
    IsActive: true,
  });

  useEffect(() => {
    if (tinterToEdit) {
      setTinter({
        TinterCode: tinterToEdit.TinterCode || "",
        IsActive: tinterToEdit.IsActive ?? true,
      });
    }
  }, [tinterToEdit]);

  const validateForm = () => {
    const code = tinter.TinterCode.trim();

    if (!code) {
      toast.error("Tinter code is required");
      return false;
    }
    if (code.length < 2 || code.length > 20) {
      toast.error("Tinter code must be 2–20 characters long");
      return false;
    }
    if (!/^(?! )[A-Za-z0-9- ]*(?<! )$/.test(code)) {
      toast.error(
        "Tinter Code can contain letters, numbers, '-', spaces (but not at start/end)"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const code = tinter.TinterCode.trim();

    try {
      const updated = await tinterService.updateTinter(tinterToEdit.TinterId, {
        PlantId: Number(plantId),
        TinterCode: code,
        IsActive: tinter.IsActive,
      });

      const updatedTinter = {
        ...updated,
        UpdatedBy: user?.user_id || updated.UpdatedBy, // use PascalCase, same as backend
      };

      onUpdate(updatedTinter);
    } catch (err) {
      console.error("Error updating tinter:", err);
      toast.error("Failed to update tinter. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-xl mb-8 max-w-lg w-full border border-green-100"
    >
      <h2 className="text-xl font-bold text-green-800 mb-4">Edit Tinter</h2>

      <input
        type="text"
        placeholder="Tinter Code"
        value={tinter.TinterCode}
        onChange={(e) => setTinter({ ...tinter, TinterCode: e.target.value })}
        className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
      />

      <label className="text-green-800 flex items-center mb-4">
        <input
          type="checkbox"
          checked={tinter.IsActive}
          onChange={(e) => setTinter({ ...tinter, IsActive: e.target.checked })}
          className="mr-2 accent-green-600"
        />
        Active
      </label>

      <button
        type="submit"
        className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded transition-colors"
      >
        Update Tinter
      </button>
    </form>
  );
};

export default UpdateTinterForm;
