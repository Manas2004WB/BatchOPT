import React, { useState } from "react";
import { batches } from "../Data/Batches";
import { skuData } from "../Data/SkuData";
import { skuVersions } from "../Data/SkuVersionData";
import AddSkuBatchForm from "./AddSkuBatchForm";
import { users } from "../Data/Data";
import { useNavigate } from "react-router-dom";

const AddSkuBatches = ({ user, plantId }) => {
  const navigate = useNavigate();
  const [batchList, setBatchList] = useState(batches);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);

  const initialBatchList = batchList.filter((batch) => {
    const version = skuVersions.find(
      (v) => v.sku_version_id === batch.sku_version_id
    );
    console.log("Version:", version);
    if (!version) return false;
    const sku = skuData.find((s) => s.sku_id === version.sku_id);
    console.log("SKU:", sku);
    return sku && sku.plant_id === Number(plantId);
  });
  const handleAddBatch = (newBatch) => {
    setBatchList((prev) => [...prev, newBatch]);
    setShowAddBatchModal(false);
  };
  const getSkuByVersionId = (versionId) => {
    const version = skuVersions.find((v) => v.sku_version_id === versionId);
    if (!version) return "-";

    const sku = skuData.find((s) => s.sku_id === version.sku_id);
    return sku?.sku_name || "-";
  };

  const getUsernamebyUserId = (updatedBy) => {
    const thisUser = users.find((u) => u.user_id === updatedBy);
    return thisUser?.username || "-";
  };

  return (
    <div className="overflow-x-auto">
      {showAddBatchModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-5xl relative">
            {/* Close button */}
            <button
              onClick={() => setShowAddBatchModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <AddSkuBatchForm
              user={user}
              plantId={plantId}
              skuData={skuData}
              skuVersions={skuVersions}
              onAddBatch={handleAddBatch}
            />
          </div>
        </div>
      )}
      <button
        onClick={() => setShowAddBatchModal(true)}
        className="mb-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded"
      >
        + Add Batches
      </button>
      <table className="min-w-full text-left border border-white/30 backdrop-blur">
        <thead className="bg-cyan-700 text-white sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 ">#</th>
            <th className="px-4 py-2 ">Batch Code</th>
            <th className="px-4 py-2 ">SKU Version </th>
            <th className="px-4 py-2 ">Batch Size</th>
            <th className="px-4 py-2 ">Status </th>
            <th className="px-4 py-2 ">Updated On</th>
            <th className="px-4 py-2 ">Updated By</th>
            <th className="px-4 py-2 ">Shots</th>
          </tr>
        </thead>
        <tbody className="bg-white/60">
          {initialBatchList.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center py-4 text-gray-500">
                No batches available.
              </td>
            </tr>
          ) : (
            initialBatchList.map((batch, index) => (
              <tr
                key={batch.batch_id}
                className="border-t border-white/30 hover:bg-white/80 transition"
              >
                <td className="px-4 py-2 ">{index + 1}</td>
                <td className="px-4 py-2 ">{batch.batch_code}</td>
                <td className="px-4 py-2  text-center">
                  {getSkuByVersionId(batch.sku_version_id)}
                </td>
                <td className="px-4 py-2  text-center">{batch.batch_size}</td>
                <td className="px-4 py-2 text-center">
                  {batch.batch_status_id === 1 ? "in-progress" : "Completed"}
                </td>
                <td className="px-4 py-2  text-center">
                  {formatDate(batch.updated_at)}
                </td>
                <td className="px-4 py-2 text-center">
                  {getUsernamebyUserId(batch.updated_by)}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-cyan-700 p-1 rounded-xl text-white"
                    onClick={() =>
                      navigate(`/shots/${batch.batch_id}`, {
                        state: { batch, plantId },
                      })
                    }
                  >
                    Shots
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default AddSkuBatches;
