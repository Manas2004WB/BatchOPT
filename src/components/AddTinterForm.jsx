import React, { useState } from "react";

const AddTinterForm = ({ onAdd, plantId, user }) => {
  const [tinter, setTinter] = useState({
    tinter_code: "",
    is_active: true,
  });
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const code = tinter.tinter_code.trim();
    if (!code) {
      return setError("Tinter code is required");
    }
    if (code.length < 2) {
      return setError("Tinter code must be at least 2 characters");
    }
    if (code.length > 20) {
      return setError("Tinter code must be at most 20 characters");
    }
    if (!/^[a-zA-Z0-9 \-]+$/.test(code)) {
      return setError(
        "Tinter code can only contain letters, numbers, spaces, and hyphens"
      );
    }
    onAdd({
      ...tinter,
      plant_id: Number(plantId),
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
    });
    setTinter({ tinter_code: "", is_active: true });
    setError("");
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
        value={tinter.tinter_code}
        onChange={(e) => setTinter({ ...tinter, tinter_code: e.target.value })}
        className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <label className="text-black flex items-center mb-4">
        <input
          type="checkbox"
          checked={tinter.is_active}
          onChange={(e) =>
            setTinter({ ...tinter, is_active: e.target.checked })
          }
          className="mr-2"
        />
        Active
      </label>

      <button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded"
      >
        Add Tinter
      </button>
    </form>
  );
};

export default AddTinterForm;
