import React, { useEffect, useState } from "react";
import { getSkusWithVersionMeasurements } from "../services/skuService";

const SkuTable = ({ user, plantId, plantName }) => {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="overflow-x-auto mt-6">
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
            skus.map((sku) => {
              if (sku.SkuVersions && sku.SkuVersions.length > 0) {
                // Find latest version (assuming sorted by date, else sort here)
                const latestVersion =
                  sku.SkuVersions[sku.SkuVersions.length - 1];
                return sku.SkuVersions.map((version, idx) => (
                  <tr
                    key={`${sku.SkuId}-${version.SkuVersionId}`}
                    className="border-t border-white/30 hover:bg-white/80 transition"
                  >
                    <td className="px-4 py-2 text-center">
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
                              <td className="px-2 py-1 border">
                                {version.StdLiquid.L ?? "-"}
                              </td>
                              <td className="px-2 py-1 border">
                                {version.StdLiquid.A ?? "-"}
                              </td>
                              <td className="px-2 py-1 border">
                                {version.StdLiquid.B ?? "-"}
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
                              <td className="px-2 py-1 border">
                                {version.PanelColor.L ?? "-"}
                              </td>
                              <td className="px-2 py-1 border">
                                {version.PanelColor.A ?? "-"}
                              </td>
                              <td className="px-2 py-1 border">
                                {version.PanelColor.B ?? "-"}
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
                              <td className="px-2 py-1 border">
                                {version.SpectroColor.L ?? "-"}
                              </td>
                              <td className="px-2 py-1 border">
                                {version.SpectroColor.A ?? "-"}
                              </td>
                              <td className="px-2 py-1 border">
                                {version.SpectroColor.B ?? "-"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {version.StdTinters?.length > 0
                        ? version.StdTinters.map((t) => t.TinterCode).join(", ")
                        : "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {version.TargetDeltaE ?? "-"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {version.UpdatedAt
                        ? new Date(version.UpdatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2">{version.Comments ?? "-"}</td>
                  </tr>
                ));
              } else {
                return (
                  <tr
                    key={sku.SkuId}
                    className="border-t border-white/30 hover:bg-white/80 transition"
                  >
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
  );
};

export default SkuTable;
