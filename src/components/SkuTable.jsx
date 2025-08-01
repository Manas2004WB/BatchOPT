// SkuTable.jsx
import React, { useState } from "react";
import { mapSkuData, formatDate } from "../utility/mapSkuData"; // Adjust path if different
import AddSkuForm from "./AddSkuForm";
import UpdateSkuForm from "./UpdateSkuForm";
import { FaEdit } from "react-icons/fa";
import { plants } from "../Data/PlantData";

const SkuTable = ({ plantId }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSku, setEditingSku] = useState(null);
  const [skus, setSkus] = useState([...mapSkuData(plantId)]);

  const getPlantNameById = (plant_Id) => {
    const plant = plants.find((p) => Number(p.plant_id) === Number(plant_Id));
    return plant ? plant.plant_name : "Unknown Plant";
  };
  // Sort so that all versions of a SKU appear together, with latest version first, and SKUs with lower srNo come first
  const tableData = [...skus].sort((a, b) => {
    // Group by skuName
    if (a.skuName !== b.skuName) {
      // If both have srNo, sort by srNo
      if (a.srNo && b.srNo) return a.srNo - b.srNo;
      // If only one has srNo, that comes first
      if (a.srNo && !b.srNo) return -1;
      if (!a.srNo && b.srNo) return 1;
      // Otherwise, sort by skuName
      return a.skuName.localeCompare(b.skuName);
    }
    // For same skuName, sort by revision descending (latest first)
    return Number(b.skuRevision) - Number(a.skuRevision);
  });

  const handleEditClick = (sku) => {
    setEditingSku(sku);
  };
  const handleUpdateSku = (updatedSku) => {
    const parent = skus.find((s) => s.skuName === updatedSku.skuName);
    setSkus((prev) => [...prev, { ...updatedSku, srNo: parent?.srNo }]);
    setEditingSku(null);
  };

  const handleAddSku = (skuObject) => {
    // For new SKU, assign srNo as max existing + 1
    const maxSrNo = skus.reduce(
      (max, sku) => (sku.srNo && sku.srNo > max ? sku.srNo : max),
      0
    );
    setSkus((prev) => [...prev, { ...skuObject, srNo: maxSrNo + 1 }]);
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
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg font-semibold text-white">Plant:</span>
        <span className="text-lg font-bold text-cyan-600 bg-cyan-100 px-3 py-1 rounded shadow-sm">
          {getPlantNameById(plantId)}
        </span>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex justify-center px-2 ">
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
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex justify-center px-2">
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

            <th className="px-2 py-1 ">
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
                  {row.srNo && Number(row.skuRevision) === 1 ? row.srNo : null}
                </td>
                <td className="px-2 py-1">{row.skuRevision}</td>
                <td className="px-2 py-1">{row.skuName}</td>
                <td className="px-2 py-1">Batches</td> {/* Static for now */}
                {/* Standard Liquid */}
                <td className="px-2 py-1">
                  <table className="w-full border border-gray-400 text-center text-xs rounded">
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 border">
                          {typeof row.standardLiquid.L === "number"
                            ? row.standardLiquid.L.toFixed(2)
                            : "-"}
                        </td>
                        <td className="px-2 py-1 border">
                          {typeof row.standardLiquid.a === "number"
                            ? row.standardLiquid.a.toFixed(2)
                            : "-"}
                        </td>
                        <td className="px-2 py-1 border">
                          {typeof row.standardLiquid.b === "number"
                            ? row.standardLiquid.b.toFixed(2)
                            : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                {/* Standard Panel */}
                <td className="px-2 py-1">
                  <table className="w-full border border-gray-400 text-center text-xs rounded">
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 border">
                          {typeof row.standardPanel.L === "number"
                            ? row.standardPanel.L.toFixed(2)
                            : "-"}
                        </td>
                        <td className="px-2 py-1 border">
                          {typeof row.standardPanel.a === "number"
                            ? row.standardPanel.a.toFixed(2)
                            : "-"}
                        </td>
                        <td className="px-2 py-1 border">
                          {typeof row.standardPanel.b === "number"
                            ? row.standardPanel.b.toFixed(2)
                            : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                {/* Spectro Panel */}
                <td className="px-2 py-1">
                  <table className="w-full border border-gray-400 text-center text-xs rounded">
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 border">
                          {typeof row.spectroPanel.L === "number"
                            ? row.spectroPanel.L.toFixed(2)
                            : "-"}
                        </td>
                        <td className="px-2 py-1 border">
                          {typeof row.spectroPanel.a === "number"
                            ? row.spectroPanel.a.toFixed(2)
                            : "-"}
                        </td>
                        <td className="px-2 py-1 border">
                          {typeof row.spectroPanel.b === "number"
                            ? row.spectroPanel.b.toFixed(2)
                            : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                      className="text-cyan-600 hover:underline border-2 p-2"
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
