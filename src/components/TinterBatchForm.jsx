import React, { useState } from "react";

const TinterBatchForm = ({
  tinterCode,
  tinterId,
  batches,
  onAddBatch,
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

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, comments, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tinter_batch_code.trim() || !form.batch_tinter_name.trim()) {
      return setError("Code and name are required");
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

  return (
    <div className=" w-full bg-white  rounded-xl shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-2">
        <h2 className="text-xl font-bold text-black mb-4">
          Batch Details : {tinterCode}
        </h2>
        {error && (
          <p className="text-red-600 bg-white/50 px-2 py-1 rounded">{error}</p>
        )}
        <div className="grid grid-cols-4 gap-4 w-full max-w-5xl">
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

            <div className="mt-2 flex items-center space-x-2">
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
          <div className="col-span-3 grid grid-cols-2 gap-4">
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
          <div className="col-span-4 flex justify-end mt-4">
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
