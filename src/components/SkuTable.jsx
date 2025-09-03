import React, { useEffect, useState } from "react";
import { getSkusWithVersionMeasurements } from "../services/skuService";
import AddSkuModal from "./AddSkuModal";
import { Toaster, toast } from "sonner";

const SkuTable = ({ user, plantId, plantName }) => {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // modal state

  useEffect(() => {
    const fetchSkus = async () => {
      try {
        const data = await getSkusWithVersionMeasurements(plantId);
        setSkus(data || []);
      } catch (err) {
        console.error("Error fetching SKUs:", err);
        setError("Failed to load SKUs");
      } finally {
        setLoading(false);
      }
    };

    if (plantId) fetchSkus();
  }, [plantId]);

  if (loading)
    return <p className="text-center text-gray-600">Loading SKUs...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  let srNo = 1;

  return (
    <div className="overflow-x-auto mt-2">
      <Toaster richColors position="top-right" />
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg font-semibold text-white">Plant:</span>
        <span className="text-lg font-bold text-cyan-600 bg-cyan-100 px-3 py-1 rounded shadow-sm">
          {plantName}
        </span>
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded"
      >
        + Add SKU
      </button>

      {/* Modal */}
      {showAddModal && (
        <AddSkuModal
          plantId={plantId}
          user={user}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            toast.success("SKU added successfully!");
            setShowAddModal(false);
            // refresh SKUs after adding
            getSkusWithVersionMeasurements(plantId).then(setSkus);
          }}
        />
      )}

      <div className="max-h-[420px] overflow-y-auto">
        <table className="min-w-full border border-white/30 shadow-2xl rounded-2xl bg-white/60 backdrop-blur">
          <thead className="bg-cyan-700 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">Sr. No</th>
              <th className="px-4 py-2">SKU Revision</th>
              <th className="px-4 py-2">SKU Code</th>
              <th className="px-4 py-2">Batches</th>
              <th className="px-4 py-2">Std. Liquid (L, a, b)</th>
              <th className="px-4 py-2">Panel Color (L, a, b)</th>
              <th className="px-4 py-2">Spectro Color (L, a, b)</th>
              <th className="px-4 py-2">Std. Tinters</th>
              <th className="px-4 py-2">Target dE</th>
              <th className="px-4 py-2">Last Updated</th>
              <th className="px-4 py-2">Comments</th>
            </tr>
          </thead>
          <tbody className="bg-white/60">
            {skus.length > 0 ? (
              skus.map((sku, skuIdx) => {
                if (sku.SkuVersions && sku.SkuVersions.length > 0) {
                  const latestVersion =
                    sku.SkuVersions[sku.SkuVersions.length - 1];
                  return (
                    <React.Fragment key={sku.SkuId}>
                      {/* Border row before each SKU except the first */}
                      {skuIdx !== 0 && (
                        <tr>
                          <td
                            colSpan="11"
                            style={{ borderTop: "4px solid #0e7490" }}
                          ></td>
                        </tr>
                      )}
                      {sku.SkuVersions.map((version, idx) => (
                        <tr
                          key={`${sku.SkuId}-${version.SkuVersionId}`}
                          className="border-t border-white/30 hover:bg-white/80 transition"
                        >
                          <td className="px-4 py-2 text-center ">
                            {version.SkuVersionId === latestVersion.SkuVersionId
                              ? srNo++
                              : ""}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {version.SkuRevision ?? "-"}
                          </td>
                          <td className="px-4 py-2">{sku.SkuName ?? "-"}</td>
                          <td className="px-4 py-2 text-center">{"Batches"}</td>
                          {/* Nested table for Std. Liquid */}
                          <td className="px-2 py-1 text-center">
                            {version.StdLiquid ? (
                              <table className="w-full text-center border border-gray-200 rounded">
                                <tbody>
                                  <tr>
                                    <td className="px-1 py-1 border">
                                      {parseFloat(version.StdLiquid.L).toFixed(
                                        2
                                      ) ?? "-"}
                                    </td>
                                    <td className="px-1 py-1 border">
                                      {parseFloat(version.StdLiquid.A).toFixed(
                                        2
                                      ) ?? "-"}
                                    </td>
                                    <td className="px-1 py-1 border">
                                      {parseFloat(version.StdLiquid.B).toFixed(
                                        2
                                      ) ?? "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            ) : (
                              "-"
                            )}
                          </td>
                          {/* Nested table for Panel Color */}
                          <td className="px-2 py-1 text-center">
                            {version.PanelColor ? (
                              <table className="w-full text-center border border-gray-200 rounded">
                                <tbody>
                                  <tr>
                                    <td className="px-1 py-1 border">
                                      {parseFloat(version.PanelColor.L).toFixed(
                                        2
                                      ) ?? "-"}
                                    </td>
                                    <td className="px-1 py-1 border">
                                      {parseFloat(version.PanelColor.A).toFixed(
                                        2
                                      ) ?? "-"}
                                    </td>
                                    <td className="px-1 py-1 border">
                                      {parseFloat(version.PanelColor.B).toFixed(
                                        2
                                      ) ?? "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            ) : (
                              "-"
                            )}
                          </td>
                          {/* Nested table for Spectro Color */}
                          <td className="px-2 py-1 text-center">
                            {version.SpectroColor ? (
                              <table className="w-full text-center border border-gray-200 rounded">
                                <tbody>
                                  <tr>
                                    <td className="px-1 py-1 border">
                                      {parseFloat(
                                        version.SpectroColor.L
                                      ).toFixed(2) ?? "-"}
                                    </td>
                                    <td className="px-1 py-1 border">
                                      {parseFloat(
                                        version.SpectroColor.A
                                      ).toFixed(2) ?? "-"}
                                    </td>
                                    <td className="px-1 py-1 border">
                                      {parseFloat(
                                        version.SpectroColor.B
                                      ).toFixed(2) ?? "-"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {version.StdTinters?.length > 0 ? (
                              <div className="flex flex-wrap gap-1 justify-center">
                                {version.StdTinters.map((tinter, idx) => (
                                  <span
                                    key={tinter.TinterCode + idx}
                                    className="inline-block bg-cyan-100 text-cyan-800 text-xs font-semibold px-2 py-1 rounded-full shadow"
                                  >
                                    {tinter.TinterCode}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {version.TargetDeltaE ?? "-"}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {version.UpdatedAt
                              ? new Date(version.UpdatedAt).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-2">
                            {version.Comments ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment key={sku.SkuId}>
                      {skuIdx !== 0 && (
                        <tr>
                          <td
                            colSpan="11"
                            style={{ borderTop: "4px solid #0e7490" }}
                          ></td>
                        </tr>
                      )}
                      <tr className="border-t border-white/30 hover:bg-white/80 transition">
                        <td className="px-4 py-2 text-center">{srNo++}</td>
                        <td className="px-4 py-2 text-center">-</td>
                        <td className="px-4 py-2">{sku.SkuCode ?? "-"}</td>
                        <td className="px-4 py-2 text-center">-</td>
                        <td className="px-4 py-2 text-center">-</td>
                        <td className="px-4 py-2 text-center">-</td>
                        <td className="px-4 py-2 text-center">-</td>
                        <td className="px-4 py-2">-</td>
                        <td className="px-4 py-2 text-center">-</td>
                        <td className="px-4 py-2 text-center">-</td>
                        <td className="px-4 py-2">-</td>
                      </tr>
                    </React.Fragment>
                  );
                }
              })
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500">
                  No SKUs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkuTable;
