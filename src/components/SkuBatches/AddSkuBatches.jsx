import React, { useEffect, useState } from "react";
import AddSkuBatchForm from "../SkuBatches/AddSkuBatchForm";
import { users } from "../../Data/Data";
import { useNavigate } from "react-router-dom";
import { formatUtcToLocal } from "../../utility/utc2ist";
import { getBatchesByPlantId, postBatch } from "../../services/batchService";
import { Toaster, toast } from "sonner";
import { hasFullAccess } from "../../utility/authUtils";

const AddSkuBatches = ({ user, plantId, plantName }) => {
  const navigate = useNavigate();
  const [batchList, setBatchList] = useState([]);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const canAction = hasFullAccess();
  const fetchBatches = async () => {
    try {
      const data = await getBatchesByPlantId(plantId);
      setBatchList(data || []);
      console.log("Fetched batches:", data);
    } catch (error) {
      console.error("Failed to fetch batches", error);
    }
  };
  useEffect(() => {
    fetchBatches();
    if (plantId) fetchBatches();
  }, [plantId]);

  const handleAddBatch = (newBatch) => {
    setBatchList((prev) => {
      const updatedList = [...prev, newBatch];
      return updatedList.sort(
        (a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt)
      );
    });
    fetchBatches();
    toast.success("Batch added successfully!");
    setShowAddBatchModal(false);
  };

  const getUsernamebyUserId = (updatedBy) => {
    const thisUser = users.find((u) => u.user_id === updatedBy);
    return thisUser?.username || "-";
  };

  return (
    <div className="overflow-x-auto rounded-lg">
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
          onClick={() => setShowAddBatchModal(true)}
          className="mb-4 bg-[#3dcd58] hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
        >
          + Add Batches
        </button>
      )}

      {showAddBatchModal && (
        <div className="fixed inset-0 bg-gray-300/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-5xl relative">
            {/* Close button */}
            <button
              onClick={() => setShowAddBatchModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <AddSkuBatchForm
              fetchBatches={fetchBatches}
              user={user}
              plantId={plantId}
              onAddBatch={handleAddBatch}
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto overflow-y-auto max-h-[500px] border border-green-100 rounded">
        <table className="min-w-full text-centre border border-green-100 backdrop-blur  font-normal">
          <thead className="bg-[#3dcd58] text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 ">#</th>
              <th className="px-4 py-2 ">Batch Code</th>
              <th className="px-4 py-2 ">SKU Version </th>
              <th className="px-4 py-2 ">Batch Size</th>
              <th className="px-4 py-2 ">Status </th>
              <th className="px-4 py-2 ">Updated On</th>
              <th className="px-4 py-2 ">Updated By</th>
              {canAction && <th className="px-4 py-2 ">Shots</th>}
            </tr>
          </thead>
          <tbody className="bg-emerald-50/60">
            {batchList.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No batches available.
                </td>
              </tr>
            ) : (
              batchList.map((batch, index) => (
                <tr
                  key={batch.BatchId}
                  className="border-t border-green-100 hover:bg-green-50 transition"
                >
                  <td className="px-4 py-2 ">{index + 1}</td>
                  <td className="px-4 py-2 ">{batch.BatchCode}</td>
                  <td className="px-4 py-2  text-center">
                    {batch.SkuVersion?.Sku?.SkuName || "Unknown"} -{" "}
                    {batch.SkuVersion?.VersionName || ""}
                  </td>
                  <td className="px-4 py-2  text-center">{batch.BatchSize}</td>
                  <td className="px-4 py-2 text-center">
                    {batch.BatchStatusId === 1
                      ? "In-Progress"
                      : batch.BatchStatusId === 2
                      ? "Completed"
                      : "Abondon"}
                  </td>
                  <td className="px-4 py-2  text-center">
                    {formatUtcToLocal(batch.UpdatedAt)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {getUsernamebyUserId(batch.UpdatedBy)}
                  </td>
                  {canAction && (
                    <td className="px-4 py-2 text-center">
                      <button
                        className="bg-[#3dcd58]  p-1 rounded-xl text-white"
                        onClick={() =>
                          navigate(`/shots/${batch.BatchId}`, {
                            state: { batch, plantId },
                          })
                        }
                      >
                        Shots
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddSkuBatches;
