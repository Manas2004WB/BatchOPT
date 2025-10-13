import React, { useEffect, useState } from "react";
import { getSkusWithVersionMeasurements } from "../../services/skuService";
import AddSkuModal from "./AddSkuModal";
import { Toaster } from "sonner";
import { GetOlderVersionsMeasurements } from "../../services/skuService";
import UpdatedVersionRow from "./UpdatedVersionRow";
import OldVersionRow from "./OldVersionRow";
import { hasFullAccess } from "../../utility/authUtils";

const SkuTable = ({ user, plantId, plantName }) => {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [loadingRows, setLoadingRows] = useState({});
  const canAction = hasFullAccess();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">{error}</p>;

  let srNo = 1;

  const handleToggleExpand = async (skuId) => {
    if (expandedRows[skuId]) {
      // collapse if already expanded
      setExpandedRows((prev) => {
        const copy = { ...prev };
        delete copy[skuId];
        return copy;
      });
    } else {
      try {
        setLoadingRows((prev) => ({ ...prev, [skuId]: true })); // start loader
        const olderVersions = await GetOlderVersionsMeasurements(skuId);
        setExpandedRows((prev) => ({
          ...prev,
          [skuId]: olderVersions,
        }));
      } catch (err) {
        console.error("Error fetching older versions:", err);
      } finally {
        setLoadingRows((prev) => {
          const copy = { ...prev };
          delete copy[skuId];
          return copy;
        });
      }
    }
  };

  return (
    <div className="overflow-x-auto ">
      <Toaster position="top-right" richColors />
      <div
        className={`flex items-center justify-center gap-2 ${
          canAction ? "" : "mb-4"
        }`}
      >
        <span className="text-lg font-semibold text-[#3dcd58]">Plant:</span>
        <span className="text-lg font-bold text-[#3dcd58] bg-green-100 px-3 py-1 rounded shadow-sm">
          {plantName}
        </span>
      </div>
      {canAction && (
        <button
          onClick={() => setShowAddModal(true)}
          className="mb-4 bg-[#3dcd58] hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded"
        >
          + Add SKU
        </button>
      )}

      {/* Modal */}
      {showAddModal && (
        <AddSkuModal
          plantId={plantId}
          user={user}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            // refresh SKUs after adding
            getSkusWithVersionMeasurements(plantId).then(setSkus);
          }}
        />
      )}

      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin overflow-x-hidden ">
        <table className="min-w-full border shadow-2xl rounded-2xl border-green-100 bg-white/60 backdrop-blur  font-normal">
          <thead className="bg-[#3dcd58] text-white sticky top-0 z-10 shadow-md">
            <tr className="text-sm">
              <th className="px-3 py-1">Sr. No</th>
              <th className="px-3 py-1">SKU Revision</th>
              <th className="px-3 py-1">SKU Code</th>
              <th className="px-3 py-1">Batches Count</th>

              {/* Liquid Color */}
              <th className="px-3 py-1">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold">Liquid Color</span>
                  <table className="w-full text-center border border-gray-200 rounded bg-white text-[#3dcd58] text-xs font-medium">
                    <tbody>
                      <tr>
                        <td className="px-1 py-1 border">L</td>
                        <td className="px-1 py-1 border">a</td>
                        <td className="px-1 py-1 border">b</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </th>

              {/* Panel Color */}
              <th className="px-3 py-1">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold">Panel Color</span>
                  <table className="w-full text-center border border-gray-200 rounded bg-white text-[#3dcd58] text-xs font-medium">
                    <tbody>
                      <tr>
                        <td className="px-1 py-1 border">L</td>
                        <td className="px-1 py-1 border">a</td>
                        <td className="px-1 py-1 border">b</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </th>

              {/* Spectro Color */}
              <th className="px-3 py-1">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold">Spectro Color</span>
                  <table className="w-full text-center border border-gray-200 rounded bg-white text-[#3dcd58] text-xs font-medium">
                    <tbody>
                      <tr>
                        <td className="px-1 py-1 border">L</td>
                        <td className="px-1 py-1 border">a</td>
                        <td className="px-1 py-1 border">b</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </th>

              <th className="px-3 py-1">Std. Tinters</th>
              <th className="px-3 py-1">Target dE</th>
              <th className="px-3 py-1">Last Updated</th>
              <th className="px-3 py-1">Comments</th>
            </tr>
          </thead>

          <tbody className="bg-emerald-50/30">
            {skus.length > 0 ? (
              skus.map((sku, skuIdx) => {
                if (sku.SkuVersions && sku.SkuVersions.length > 0) {
                  const latestVersion = sku.SkuVersions[0];
                  return (
                    <React.Fragment key={sku.SkuId}>
                      {/* Border row before each SKU except the first */}
                      <UpdatedVersionRow
                        expandedRows={expandedRows}
                        latestVersion={latestVersion}
                        handleToggleExpand={handleToggleExpand}
                        sku={sku}
                        srNo={srNo++}
                      />
                      {/* Accordion content */}
                      {loadingRows[sku.SkuId] ? (
                        <tr>
                          <td colSpan={11} className="p-4 text-center">
                            <span className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent inline-block"></span>
                          </td>
                        </tr>
                      ) : expandedRows[sku.SkuId]?.length ? (
                        <OldVersionRow expandedRows={expandedRows} sku={sku} />
                      ) : null}
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
