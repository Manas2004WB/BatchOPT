// SkuTable.jsx
import React, { useState } from "react";
import { mapSkuData, formatDate } from "../utility/mapSkuData"; // Adjust path if different
import AddSkuForm from "./AddSkuForm";
import UpdateSkuForm from "./UpdateSkuForm";
import { FaEdit } from "react-icons/fa";

const SkuTable = ({ plantId }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSku, setEditingSku] = useState(null);
  const [skus, setSkus] = useState([...mapSkuData(plantId)]); // and update this
  const tableData = skus;

  const handleEditClick = (sku) => {
    setEditingSku(sku);
  };
  const handleUpdateSku = (updatedSku) => {
    setSkus((prevSkus) => [...prevSkus, updatedSku]); // add new revision
    setEditingSku(null);
  };

  const handleAddSku = (skuObject) => {
    setSkus((prev) => [...prev, skuObject]);
    setShowAddModal(false);
  };
  const latestRevisionsMap = {};
  tableData.forEach((row) => {
    const name = row.skuName;
    const rev = Number(row.skuRevision);
    if (!latestRevisionsMap[name] || rev > latestRevisionsMap[name]) {
      latestRevisionsMap[name] = rev;
    }
  });

  return (
    <div className="overflow-x-auto rounded-lg w-full">
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex justify-center px-2 mt-16">
          <div className="self-center bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-y-auto relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl z-10"
              onClick={() => setShowAddModal(false)}
            >
              &times;
            </button>

            {/* Scrollable modal content */}
            <div className=" px-6 pb-6">
              <AddSkuForm plantId={plantId} onAdd={handleAddSku} />
            </div>
          </div>
        </div>
      )}
      {editingSku && (
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex justify-center px-2 mt-16">
          <div className="self-center bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-y-auto relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl z-10"
              onClick={() => setEditingSku(null)}
            >
              &times;
            </button>
            <div className="px-6 pb-6">
              <UpdateSkuForm
                plantId={plantId}
                skuToEdit={editingSku}
                onUpdate={handleUpdateSku}
              />
            </div>
          </div>
        </div>
      )}

      <button
        className="mb-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded"
        onClick={() => setShowAddModal(true)}
      >
        + Add SKU
      </button>

      <table className="min-w-full text-left border border-white/30 backdrop-blur text-sm">
        <thead className="bg-cyan-700 text-white sticky top-0 z-10 ">
          <tr>
            <th className="px-2 py-1">Sr. No</th>
            <th className="px-2 py-1">SKU Revision</th>
            <th className="px-2 py-1">SKU Code</th>
            <th className="px-2 py-1">Batches</th>

            <th className="px-2 py-1">
              Std. Liquid
              <br />
              (L, a, b)
            </th>
            <th className="px-2 py-1">
              Panel Color
              <br />
              (L, a, b)
            </th>
            <th className="px-2 py-1">
              Spectro Color
              <br />
              (L, a, b)
            </th>

            <th className="px-2 py-1">Std. Tinters</th>
            <th className="px-2 py-1">Target dE</th>
            <th className="px-2 py-1">Last Updated</th>
            <th className="px-2 py-1">Comments</th>
            <th className="px-2 py-1">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white/60">
          {tableData.length === 0 ? (
            <tr>
              <td colSpan="12" className="text-center py-4 text-gray-500">
                No SKU data available for this plant.
              </td>
            </tr>
          ) : (
            tableData.map((row, index) => (
              <tr
                key={row.sku_version_id || index}
                className="border-t border-white/30 hover:bg-white/80 transition"
              >
                <td className="px-4 py-2">
                  {Number(row.skuRevision) === 1 ? row.srNo : null}
                </td>
                <td className="px-2 py-1">{row.skuRevision}</td>
                <td className="px-2 py-1">{row.skuName}</td>
                <td className="px-2 py-1">Batches</td> {/* Static for now */}
                {/* Standard Liquid */}
                <td className="px-2 py-1">
                  <div className="grid grid-cols-3 text-center text-sm divide-x divide-gray-400  overflow-hidden">
                    <div className="px-2">
                      {typeof row.standardLiquid.L === "number"
                        ? row.standardLiquid.L.toFixed(2)
                        : "-"}
                    </div>
                    <div className="px-2">
                      {typeof row.standardLiquid.a === "number"
                        ? row.standardLiquid.a.toFixed(2)
                        : "-"}
                    </div>
                    <div className="px-2">
                      {typeof row.standardLiquid.b === "number"
                        ? row.standardLiquid.b.toFixed(2)
                        : "-"}
                    </div>
                  </div>
                </td>
                {/* Standard Panel */}
                <td className="px-2 py-1">
                  <div className="grid grid-cols-3 text-center text-sm divide-x divide-gray-400  overflow-hidden">
                    <div className="px-2">
                      {typeof row.standardPanel.L === "number"
                        ? row.standardPanel.L.toFixed(2)
                        : "-"}
                    </div>
                    <div className="px-2">
                      {typeof row.standardPanel.a === "number"
                        ? row.standardPanel.a.toFixed(2)
                        : "-"}
                    </div>
                    <div className="px-2">
                      {typeof row.standardPanel.b === "number"
                        ? row.standardPanel.b.toFixed(2)
                        : "-"}
                    </div>
                  </div>
                </td>
                {/* Spectro Panel */}
                <td className="px-2 py-1">
                  <div className="grid grid-cols-3 text-center text-sm divide-x divide-gray-400  overflow-hidden">
                    <div className="px-2">
                      {typeof row.spectroPanel.L === "number"
                        ? row.spectroPanel.L.toFixed(2)
                        : "-"}
                    </div>
                    <div className="px-2">
                      {typeof row.spectroPanel.a === "number"
                        ? row.spectroPanel.a.toFixed(2)
                        : "-"}
                    </div>
                    <div className="px-2">
                      {typeof row.spectroPanel.b === "number"
                        ? row.spectroPanel.b.toFixed(2)
                        : "-"}
                    </div>
                  </div>
                </td>
                <td className="px-2 py-1">
                  {(row.standardTinters || []).join(", ") || "-"}
                </td>
                <td className="px-2 py-1">{row.targetDeltaE}</td>
                <td className="px-2 py-1">{row.lastUpdated}</td>
                <td className="px-2 py-1">{row.comments}</td>
                <td className="px-2 py-1">
                  {latestRevisionsMap[row.skuName] ===
                    Number(row.skuRevision) && (
                    <button
                      className="text-blue-600 hover:underline border-2 p-2"
                      onClick={() => handleEditClick(row)}
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SkuTable;
