import React, { useEffect, useState } from "react";
import { batches } from "../Data/Batches";
import { skuData } from "../Data/SkuData";
import { skuVersions } from "../Data/SkuVersionData";
import AddSkuBatchForm from "./AddSkuBatchForm";
import { users } from "../Data/Data";
import { useNavigate } from "react-router-dom";
import { plants } from "../Data/PlantData";
import { getBatchesByPlantId } from "../services/batchService";
import { getUserNameById } from "../services/userService";

const AddSkuBatches = ({ user, plantId }) => {
  const navigate = useNavigate();
  const [batchList, setBatchList] = useState([]);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);

  const getPlantNameById = (plant_Id) => {
    const plant = plants.find((p) => Number(p.plant_id) === Number(plant_Id));
    return plant ? plant.plant_name : "Unknown Plant";
  };

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await getBatchesByPlantId(plantId);
        setBatchList(data || []);
        console.log("Fetched batches:", data);
      } catch (error) {
        console.error("Failed to fetch batches", error);
      }
    };
    if (plantId) fetchBatches();
  }, [plantId]);

  const handleAddBatch = (newBatch) => {
    setBatchList((prev) => [...prev, newBatch]);
    setShowAddBatchModal(false);
  };

  const getUsernamebyUserId = (updatedBy) => {
    const thisUser = users.find((u) => u.user_id === updatedBy);
    return thisUser?.username || "-";
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-cente justify-center gap-2">
        <span className="text-lg font-semibold text-white">Plant:</span>
        <span className="text-lg font-bold text-cyan-600 bg-cyan-100 px-3 py-1 rounded shadow-sm">
          {getPlantNameById(plantId)}
        </span>
      </div>
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
      <table className="min-w-full text-centre border border-white/30 backdrop-blur">
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
        <tbody className="bg-white/60 ">
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
                className="border-t border-white/30 hover:bg-white/80 transition"
              >
                <td className="px-4 py-2 ">{index + 1}</td>
                <td className="px-4 py-2 ">{batch.BatchCode}</td>
                <td className="px-4 py-2  text-center">
                  {batch.SkuVersion.Sku.SkuName} -{" "}
                  {batch.SkuVersion.VersionName}
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
                  {formatDate(batch.UpdatedAt)}
                </td>
                <td className="px-4 py-2 text-center">
                  {getUsernamebyUserId(batch.UpdatedBy)}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-cyan-700 p-1 rounded-xl text-white"
                    onClick={() =>
                      navigate(`/shots/${batch.BatchId}`, {
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
