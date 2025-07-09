// SkuTable.jsx
import React from "react";
import { mapSkuData, formatDate } from "../utility/mapSkuData"; // Adjust path if different

const SkuTable = ({ plantId }) => {
  const tableData = mapSkuData(plantId); // Filtered + flattened
  console.log(tableData);
  return (
    <div className="overflow-x-auto rounded-lg">
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
                  {row.skuRevision === "1" ? row.srNo : null}
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SkuTable;
