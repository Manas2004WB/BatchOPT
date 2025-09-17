import React, { useEffect, useState } from "react";
import { getSkusWithVersionMeasurements } from "../../services/skuService";
import AddSkuModal from "./AddSkuModal";
import { Toaster } from "sonner";
import { GetOlderVersionsMeasurements } from "../../services/skuService";
import UpdatedVersionRow from "./UpdatedVersionRow";
import OldVersionRow from "./OldVersionRow";

const SkuTable = ({ user, plantId, plantName }) => {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

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
    return (
      <div className="flex  justify-center items-center-safe">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
        const olderVersions = await GetOlderVersionsMeasurements(skuId);
        setExpandedRows((prev) => ({
          ...prev,
          [skuId]: olderVersions,
        }));
      } catch (err) {
        console.error("Error fetching older versions:", err);
      }
    }
  };

  return (
    <div className="overflow-x-auto ">
      <Toaster position="top-right" richColors />
      <div className=" flex items-center justify-center gap-2">
        <span className="text-lg font-semibold text-white">Plant:</span>
        <span className="text-lg font-bold text-white bg-[#3dcd58] px-3 py-1 rounded shadow-sm">
          {plantName}
        </span>
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 bg-[#3dcd58] hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded"
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
            setShowAddModal(false);
            // refresh SKUs after adding
            getSkusWithVersionMeasurements(plantId).then(setSkus);
          }}
        />
      )}

      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin overflow-x-hidden">
        <table className="min-w-full border shadow-2xl rounded-2xl border-green-100 bg-white/60 backdrop-blur">
          <thead className="bg-[#3dcd58] text-white sticky top-[-2px] z-10 shadow-md">
            <tr>
              <th className="px-4 py-2">Sr. No</th>
              <th className="px-4 py-2">SKU Revision</th>
              <th className="px-4 py-2">SKU Code</th>
              <th className="px-4 py-2">Batches Count</th>
              <th className="px-4 py-2">
                <div className="flex flex-col item-centre gap-2">
                  <span>Liquid Color</span>
                  <table>
                    <thead>
                      <tr className="flex justify-between">
                        <th className="px-2 py-1 bg-white  text-[#3dcd58] text-l">
                          L
                        </th>
                        <th className="px-2 py-1  bg-white text-[#3dcd58] text-l">
                          a
                        </th>
                        <th className="px-2 py-1  bg-white  text-[#3dcd58] text-l">
                          b
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </th>
              <th className="px-4 py-2">
                <div className="flex flex-col item-centre gap-2">
                  <span>Panel Color</span>
                  <table>
                    <thead>
                      <tr className="flex justify-between">
                        <th className="px-2 py-1 bg-white  text-[#3dcd58] text-l">
                          L
                        </th>
                        <th className="px-2 py-1  bg-white text-[#3dcd58] text-l">
                          a
                        </th>
                        <th className="px-2 py-1  bg-white  text-[#3dcd58] text-l">
                          b
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </th>
              <th className="px-4 py-2">
                <div className="flex flex-col item-centre gap-2">
                  <span>Spectro Color</span>
                  <table>
                    <thead>
                      <tr className="flex justify-between">
                        <th className="px-2 py-1 bg-white  text-[#3dcd58] text-l">
                          L
                        </th>
                        <th className="px-2 py-1  bg-white text-[#3dcd58] text-l">
                          a
                        </th>
                        <th className="px-2 py-1  bg-white  text-[#3dcd58] text-l">
                          b
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </th>
              <th className="px-4 py-2">Std. Tinters</th>
              <th className="px-4 py-2">Target dE</th>
              <th className="px-4 py-2">Last Updated</th>
              <th className="px-4 py-2">Comments</th>
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
                      {expandedRows[sku.SkuId] &&
                        expandedRows[sku.SkuId].length > 0 && (
                          <OldVersionRow
                            expandedRows={expandedRows}
                            sku={sku}
                          />
                        )}
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
