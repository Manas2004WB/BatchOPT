import React, { useEffect, useState } from "react";
import AddTinterForm from "./AddTinterForm";
import UpdateTinterForm from "./UpdateTinterForm";
import TinterBatchForm from "./TinterBatchForm";
import { FaEdit } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import tinterService from "../services/tinterService"; // ✅ import API service
import { MdDelete } from "react-icons/md";

const TinterTable = ({ plantId, user, plantName }) => {
  console.log("TinterTable props - PlantId:", plantId);
  const [editingTinter, setEditingTinter] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tinterList, setTinterList] = useState([]);
  const [selectedTinter, setSelectedTinter] = useState(null);
  const [showBatchForm, setShowBatchForm] = useState(false);

  // ✅ Fetch tinters for this plant
  useEffect(() => {
    const fetchTinters = async () => {
      try {
        const data = await tinterService.getTinters();
        console.log("All tinters from API:", data);

        // filter only for this plant
        const filtered = data.filter(
          (t) => Number(t.PlantId) === Number(plantId)
        );

        console.log("Filtered tinters:", filtered);
        setTinterList(filtered);

        setTinterList(filtered);
        console.log("Fetched tinters:", filtered);
      } catch (error) {
        console.error("Error fetching tinters:", error);
      }
    };
    fetchTinters();
  }, [plantId]);

  // ✅ Add Tinter (API + state update)
  const handleAddTinter = (createdTinter) => {
    setTinterList((prev) => [...prev, createdTinter]);
  };

  // ✅ Update Tinter
  const handleUpdateTinter = (updatedTinter) => {
    setTinterList((prev) =>
      prev.map((t) =>
        t.TinterId === updatedTinter.TinterId ? updatedTinter : t
      )
    );
    setShowEditModal(false);
  };

  // ✅ Delete Tinter
  const handleDeleteTinter = async (id) => {
    try {
      await tinterService.deleteTinter(id);
      setTinterList((prev) => prev.filter((t) => t.TinterId !== id));
    } catch (error) {
      console.error("Error deleting tinter:", error);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg font-semibold text-white">Plant:</span>
        <span className="text-lg font-bold text-cyan-600 bg-cyan-100 px-3 py-1 rounded shadow-sm">
          {plantName}
        </span>
      </div>

      <button
        className="mb-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded"
        onClick={() => setShowAddModal(true)}
      >
        + Add Tinter
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <AddTinterForm
              user={user}
              plantId={plantId}
              onAdd={(tinter) => {
                handleAddTinter(tinter);
                setShowAddModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showEditModal && editingTinter && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <UpdateTinterForm
              user={user}
              plantId={plantId}
              tinterToEdit={editingTinter}
              onUpdate={handleUpdateTinter}
            />
          </div>
        </div>
      )}

      {/* Batch Form */}
      {showBatchForm && selectedTinter && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-5xl relative">
            <button
              onClick={() => setShowBatchForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <TinterBatchForm
              tinterId={selectedTinter.tinter_id}
              tinterCode={selectedTinter.tinter_code}
              batches={allBatches}
              onAddBatch={(newBatch) =>
                setAllBatches((prev) => [...prev, newBatch])
              }
              onUpdateBatch={(updatedBatch) =>
                setAllBatches((prev) =>
                  prev.map((batch) =>
                    batch.tinter_batch_code === updatedBatch.tinter_batch_code
                      ? updatedBatch
                      : batch
                  )
                )
              }
              userId={user?.user_id}
            />
          </div>
        </div>
      )}

      <table className="min-w-full text-left border border-white/30 backdrop-blur">
        <thead className="bg-cyan-700 text-white sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2">Tinter Code</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Updated By</th>
            <th className="px-4 py-2">Updated At</th>
            <th className="px-4 py-2">Edit</th>
            <th className="px-4 py-2">Batches</th>
            <th className="px-4 py-2">Delete</th>
          </tr>
        </thead>
        <tbody className="bg-white/60">
          {tinterList.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No tinter data for this plant.
              </td>
            </tr>
          ) : (
            tinterList.map((tinter) => (
              <tr
                key={tinter.TinterId}
                className="border-t border-white/30 hover:bg-white/80 transition"
              >
                <td className="px-4 py-2">{tinter.TinterCode}</td>
                <td className="px-4 py-2">
                  {tinter.IsActive ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-2">{tinter.UpdatedBy}</td>
                <td className="px-4 py-2">{tinter.UpdatedAt}</td>
                <td className="px-4 py-2">
                  <button
                    className="border-1 p-1 mx-2 text-cyan-600 hover:text-cyan-800"
                    onClick={() => {
                      setEditingTinter(tinter);
                      setShowEditModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedTinter(tinter);
                      setShowBatchForm(true);
                    }}
                    className="border-1 p-1 mx-2 text-cyan-600 hover:text-cyan-800"
                  >
                    <IoIosAddCircleOutline />
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteTinter(tinter.TinterId)}
                    className="border-1 p-1 mx-2 text-cyan-600 hover:text-cyan-800"
                  >
                    <MdDelete />
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

export default TinterTable;
