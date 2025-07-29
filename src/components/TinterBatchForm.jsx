import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

const TinterBatchForm = ({
  tinterCode,
  tinterId,
  batches,
  onAddBatch,
  onUpdateBatch,
  userId,
}) => {
  const [form, setForm] = useState({
    tinter_batch_code: "",
    batch_tinter_name: "",
    strength: "",
    comments: "",
    is_active: true,
    panel_L: "",
    panel_a: "",
    panel_b: "",
    liquid_L: "",
    liquid_a: "",
    liquid_b: "",
  });
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [error, setError] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, comments, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = form.tinter_batch_code.trim();
    const name = form.batch_tinter_name.trim();
    const strength = form.strength;
    // Validate code
    if (!code) {
      return setError("Batch code is required");
    }
    if (code.length < 2 || code.length > 20) {
      return setError("Batch code must be 2-20 characters");
    }
    if (!/^[a-zA-Z0-9 \-]+$/.test(code)) {
      return setError(
        "Batch code can only contain letters, numbers, spaces, and hyphens"
      );
    }
    // Validate name
    if (!name) {
      return setError("Tinter name is required");
    }
    if (name.length < 2 || name.length > 30) {
      return setError("Tinter name must be 2-30 characters");
    }
    if (!/^[a-zA-Z0-9 \-]+$/.test(name)) {
      return setError(
        "Tinter name can only contain letters, numbers, spaces, and hyphens"
      );
    }
    // Validate strength
    if (!strength || isNaN(strength) || Number(strength) <= 0) {
      return setError("Strength must be a positive number");
    }
    // Validate panel and liquid L a b
    const labFields = [
      "panel_L",
      "panel_a",
      "panel_b",
      "liquid_L",
      "liquid_a",
      "liquid_b",
    ];
    for (let field of labFields) {
      if (form[field] === "" || isNaN(form[field])) {
        return setError("All L, a, b values must be numbers");
      }
    }

    const now = new Date().toISOString();
    const newBatch = {
      ...form,
      strength: parseFloat(form.strength) || null,
      tinter_id: tinterId,
      created_by: userId,
      updated_by: userId,
      created_at: now,
      updated_at: now,
    };

    onAddBatch(newBatch);
    setForm({
      tinter_batch_code: "",
      batch_tinter_name: "",
      strength: "",
      comments: "",
      is_active: true,
      panel_L: "",
      panel_a: "",
      panel_b: "",
      liquid_L: "",
      liquid_a: "",
      liquid_b: "",
    });
    setError("");
  };

  const filteredBatches = batches.filter(
    (batch) => batch.tinter_id === tinterId
  );

  const handleConfirmDelete = () => {
    const now = new Date().toISOString();
    const batchToUpdate = batches.find(
      (b) => b.tinter_batch_id === selectedBatchId
    );
    console.log("Found batch:", batchToUpdate);

    if (batchToUpdate) {
      const updatedBatch = {
        ...batchToUpdate,
        is_active: false,
        updated_at: now,
        updated_by: userId,
      };
      console.log("Sending to parent:", updatedBatch);
      onUpdateBatch(updatedBatch); // call parent's state update function
    }
    setShowDeleteAlert(false);
    setSelectedBatchId(null);
  };

  return (
    <div className=" w-full bg-white  rounded-xl shadow-xl">
      {showDeleteAlert && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 text-center">
              Are you sure you want to make this tinter inactive?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleConfirmDelete} // replace with your actual delete function
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <h2 className="text-xl font-bold text-black mb-4">
          Batch Details : {tinterCode}
        </h2>
        {error && (
          <p className="text-red-600 bg-white/50 px-2 py-1 rounded">{error}</p>
        )}
        <div className="grid grid-cols-5 gap-4 w-full max-w-5xl">
          {/* --- First Row: Batch Info --- */}
          <div className="col-span-1">
            <label className="flex flex-col">
              <span className="mb-1 text-gray-700">Tinter Name</span>
              <input
                type="text"
                name="batch_tinter_name"
                placeholder="Tinter Name"
                value={form.batch_tinter_name}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              />
            </label>
          </div>

          <div className="col-span-1">
            <label className="flex flex-col">
              <span className="mb-1 text-gray-700">Tinter Batch Code</span>
              <input
                type="text"
                name="tinter_batch_code"
                placeholder="Batch Code"
                value={form.tinter_batch_code}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              />
            </label>
          </div>

          <div className="col-span-1">
            <label className="flex flex-col">
              <span className="mb-1 text-gray-700">Strength</span>
              <input
                type="number"
                step="0.01"
                name="strength"
                placeholder="Strength"
                value={form.strength}
                onChange={handleChange}
                className="border rounded px-2 py-1"
              />
            </label>
          </div>
          <div className="col-span-1 mt-2 flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            <label htmlFor="is_active" className="text-gray-700">
              Active
            </label>
          </div>
          <div className="row-span-2 col-span-1">
            <label className="flex flex-col h-full">
              <span className="mb-1 text-gray-700">Comments</span>
              <textarea
                name="comments"
                placeholder="Comments"
                value={form.comments}
                onChange={handleChange}
                className=" border rounded px-4 py-2 h-full resize-none"
              />
            </label>
          </div>
          {/* --- Second Row: Lab L*a*b* values --- */}
          <div className="col-span-4 grid grid-cols-2 gap-4">
            {/* Panel LAB */}
            <div className="border rounded p-3">
              <span className="text-gray-600 font-semibold block mb-2">
                Panel L a b
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <input
                  type="number"
                  step="0.01"
                  name="panel_L"
                  placeholder="L"
                  value={form.panel_L}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  step="0.01"
                  name="panel_a"
                  placeholder="a"
                  value={form.panel_a}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  step="0.01"
                  name="panel_b"
                  placeholder="b"
                  value={form.panel_b}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>

            {/* Liquid LAB */}
            <div className="border rounded p-3">
              <span className="text-gray-600 font-semibold block mb-2">
                Liquid L a b
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <input
                  type="number"
                  step="0.01"
                  name="liquid_L"
                  placeholder="L"
                  value={form.liquid_L}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  step="0.01"
                  name="liquid_a"
                  placeholder="a"
                  value={form.liquid_a}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="number"
                  step="0.01"
                  name="liquid_b"
                  placeholder="b"
                  value={form.liquid_b}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* --- Submit Button --- */}
          <div className="col-span-4 flex justify-start mt-4">
            <button
              type="submit"
              className="bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600"
            >
              Add Batch
            </button>
          </div>
        </div>
      </form>

      {/* Display existing batches for this tinter */}
      <div className="mt-6 max-h-72 overflow-y-auto border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Batches for this Tinter</h3>
        {filteredBatches.length === 0 ? (
          <p className="text-gray-500">No batches yet.</p>
        ) : (
          <table className="min-w-full text-sm font-medium text-gray-800 border border-gray-200 rounded-lg bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Code</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left"> Panel(L , a , b)</th>
                <th className="px-4 py-2 text-left"> Liquid(L , a , b)</th>
                <th className="px-4 py-2 text-left">Strength</th>
                <th className="px-4 py-2 text-left">Active</th>
                <th className="px-4 py-2 text-left">Updated</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.map((batch, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{batch.tinter_batch_code}</td>
                  <td className="px-4 py-2">{batch.batch_tinter_name}</td>

                  {/* Panel L a b (Horizontal) */}
                  <td className="px-4 py-2">
                    <table className="text-sm w-full border border-gray-300">
                      <tbody>
                        <tr>
                          <td className=" px-2 py-1">{batch.panel_L}</td>
                          <td className=" px-2 py-1">{batch.panel_a}</td>
                          <td className="px-2 py-1">{batch.panel_b}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  {/* Liquid L a b (Horizontal) */}
                  <td className="px-4 py-2">
                    <table className="text-sm w-full border border-blue-300">
                      <tbody>
                        <tr>
                          <td className=" px-2 py-1">{batch.liquid_L}</td>
                          <td className="px-2 py-1">{batch.liquid_a}</td>
                          <td className=" px-2 py-1">{batch.liquid_b}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  <td className="px-4 py-2">{batch.strength}</td>
                  <td className="px-4 py-2">
                    {batch.is_active ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {batch.updated_at}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className={`p-4 rounded ${
                        batch.is_active
                          ? "bg-cyan-200 hover:bg-cyan-300 cursor-pointer"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      disabled={!batch.is_active}
                      onClick={() => {
                        setSelectedBatchId(batch.tinter_batch_id);
                        setShowDeleteAlert(true);
                      }}
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TinterBatchForm;
