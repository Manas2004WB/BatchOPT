import React, { useState } from "react";
import { tinterBatches } from "../Data/TinterBatches";
import { tinters } from "../Data/TinterData";
import { MdDelete } from "react-icons/md";

const ShotTinterAddModal = ({
  handleCloseTinterModal,
  tinterModalShotIndex,
  recipeTinters = [],
}) => {
  const [rows, setRows] = useState([]);
  const [deletedStaticIndexes, setDeletedStaticIndexes] = useState([]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { tinter_code: "", tinter_batch_id: "", tinter_weights: "" },
    ]);
  };

  const handleDelete = (isStatic, index) => {
    if (isStatic) {
      setDeletedStaticIndexes((prev) => [...prev, index]);
    } else {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
    }
  };

  const handleTinterChange = (index, selectedTinterCode) => {
    const updatedRows = [...rows];
    updatedRows[index].tinter_code = selectedTinterCode;
    updatedRows[index].tinter_batch_id = ""; // reset batch when tinter changes
    updatedRows[index].tinter_weights = "";
    setRows(updatedRows);
  };

  const handleBatchChange = (index, selectedBatchId) => {
    const updatedRows = [...rows];
    updatedRows[index].tinter_batch_id = selectedBatchId;
    updatedRows[index].tinter_weights = "";
    setRows(updatedRows);
  };

  const isSaveDisabled = () => {
    // Check static rows (recipeTinters): always require a batch and weight for each
    // Since static rows are not tracked in state, you may need to track their values in state for full validation
    // For now, only check dynamic rows
    if (rows.length === 0) return true;
    for (const row of rows) {
      if (!row.tinter_code || !row.tinter_batch_id || !row.tinter_weights) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-3xl text-black shadow-lg">
      <h2 className="text-xl font-bold mb-4">
        Select Tinters for Shot {tinterModalShotIndex}
      </h2>

      <div className="flex justify-between items-center mb-2 overflow-auto max-h-1/2">
        <h3 className="text-lg font-medium">Tinter Dosing</h3>
        <span className="bg-green-500 text-white px-3 py-1 rounded text-sm">
          Recommended Tinter Options
        </span>
      </div>

      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-cyan-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Sr. No</th>
            <th className="px-4 py-2 text-left">Tinter Name</th>
            <th className="px-4 py-2 text-left">Select Batch</th>
            <th className="px-4 py-2 text-left">Tinter Weights (in kg)</th>
            <th className="px-4 py-2 text-left">Delete</th>
          </tr>
        </thead>
        <tbody className="bg-cyan-50">
          {/* Static recipeTinters */}
          {recipeTinters.map((tinterCode, index) => {
            if (deletedStaticIndexes.includes(index)) return null;
            const matchedTinter = tinters.find(
              (t) => t.tinter_code === tinterCode
            );
            const matchingBatches = tinterBatches.filter(
              (batch) =>
                batch.tinter_id === matchedTinter?.tinter_id && batch.is_active
            );

            return (
              <tr key={`static-${index}`} className="border-t border-gray-300">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{tinterCode}</td>
                <td className="px-4 py-2">
                  <select className="border rounded px-2 py-1 w-full">
                    <option value="">Select Batch</option>
                    {matchingBatches.map((batch) => (
                      <option
                        key={batch.tinter_batch_id}
                        value={batch.tinter_batch_id}
                      >
                        {batch.tinter_batch_code} - {batch.batch_tinter_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="0"
                    value={rows.tinter_weights}
                    className="bg-white/60 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                  />
                </td>
                <td className="text-center">
                  <button
                    onClick={() => handleDelete(true, index)}
                    className="p-1"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            );
          })}

          {/* Dynamic rows */}
          {rows.map((row, index) => {
            const matchedTinter = tinters.find(
              (t) => t.tinter_code === row.tinter_code
            );

            const matchingBatches = matchedTinter
              ? tinterBatches.filter(
                  (batch) =>
                    batch.tinter_id === matchedTinter.tinter_id &&
                    batch.is_active
                )
              : [];

            const srNo =
              recipeTinters.filter((_, i) => !deletedStaticIndexes.includes(i))
                .length +
              index +
              1;

            return (
              <tr key={`dynamic-${index}`} className="border-t border-gray-300">
                <td className="px-4 py-2">{srNo}</td>
                <td className="px-4 py-2">
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={row.tinter_code}
                    onChange={(e) => handleTinterChange(index, e.target.value)}
                  >
                    <option value="">Select Tinter</option>
                    {tinters
                      .filter((t) => t.is_active)
                      .map((t) => (
                        <option key={t.tinter_id} value={t.tinter_code}>
                          {t.tinter_code}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={row.tinter_batch_id}
                    onChange={(e) => handleBatchChange(index, e.target.value)}
                    disabled={!row.tinter_code}
                  >
                    <option value="">Select Batch</option>
                    {matchingBatches.map((batch) => (
                      <option
                        key={batch.tinter_batch_id}
                        value={batch.tinter_batch_id}
                      >
                        {batch.tinter_batch_code} - {batch.batch_tinter_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="0"
                    value={row.tinter_weights}
                    onChange={(e) => {
                      const updatedRows = [...rows];
                      updatedRows[index].tinter_weights = e.target.value;
                      setRows(updatedRows);
                    }}
                    className="bg-white/60 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </td>

                <td className="text-center">
                  <button
                    onClick={() => handleDelete(false, index)}
                    className="p-1"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between">
        <button
          className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
          onClick={handleAddRow}
        >
          + Add Row
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaveDisabled()}
        >
          Save
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          onClick={handleCloseTinterModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShotTinterAddModal;
