import React, { useEffect, useState } from "react";
import AddTinterForm from "./AddTinterForm";
import UpdateTinterForm from "./UpdateTinterForm";
import TinterBatchForm from "./TinterBatchForm";
import { FaEdit } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import tinterService from "../services/tinterService"; // ✅ import API service
import { MdDelete } from "react-icons/md";
import { Toaster, toast } from "sonner";
import { users } from "../Data/Data";
import { formatUtcToLocal } from "../utility/utc2ist";

const TinterTable = ({ plantId, user, plantName }) => {
  console.log("TinterTable props - PlantId:", plantId);
  const [editingTinter, setEditingTinter] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tinterList, setTinterList] = useState([]);
  const [selectedTinter, setSelectedTinter] = useState(null);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batches, setBatches] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    tinterId: null,
  });
  const getUsernamebyUserId = (updatedBy) => {
    const thisUser = users.find((u) => u.user_id === updatedBy);
    return thisUser?.username || "-";
  };

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
        console.log("Fetched tinters:", filtered);
      } catch (error) {
        console.error("Error fetching tinters:", error);
      }
    };
    fetchTinters();
  }, [plantId]);

  const handleAddTinter = (createdTinter) => {
    try {
      setTinterList((prev) => {
        const updatedList = [...prev, createdTinter];
        return updatedList.sort(
          (a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt)
        );
      });
      toast.success("Tinter added successfully.");
    } catch (error) {
      console.error("Failed to add tinter", error);
      toast.error("Failed to add tinter.");
    }
  };

  // ✅ Update Tinter
  const handleUpdateTinter = (updatedTinter) => {
    try {
      setTinterList((prev) => {
        const updatedList = prev.map((t) =>
          t.TinterId === updatedTinter.TinterId ? updatedTinter : t
        );

        // ✅ sort by UpdatedAt (latest first)
        return updatedList.sort(
          (a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt)
        );
      });

      setShowEditModal(false);
      toast.success("Tinter updated successfully.");
    } catch (error) {
      console.error("Failed to update tinter", error);
      toast.error("Failed to update tinter.");
    }
  };

  // ✅ Delete Tinter with confirmation
  const handleDeleteTinter = async (id) => {
    setConfirmDelete({ open: true, tinterId: id });
  };

  const confirmDeleteTinter = async () => {
    try {
      await tinterService.deleteTinter(confirmDelete.tinterId);
      toast.success("Tinter deleted successfully.");
      setTinterList((prev) =>
        prev.filter((t) => t.TinterId !== confirmDelete.tinterId)
      );
    } catch (error) {
      console.error("Error deleting tinter:", error);
    } finally {
      setConfirmDelete({ open: false, tinterId: null });
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <Toaster position="top-right" richColors />
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="text-lg font-semibold text-green-800">Plant:</span>
        <span className="text-lg font-bold text-green-700 bg-green-100 px-3 py-1 rounded shadow-sm">
          {plantName}
        </span>
      </div>

      <button
        className="mb-4 bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded"
        onClick={() => setShowAddModal(true)}
      >
        + Add Tinter
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-300/10 backdrop-blur-sm flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-gray-300/10 backdrop-blur-sm flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-gray-300/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-5xl relative">
            <button
              onClick={() => setShowBatchForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <TinterBatchForm
              tinterId={selectedTinter.TinterId}
              tinterCode={selectedTinter.TinterCode}
              userId={user?.UserId}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-gray-300/10 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
            <h2 className="text-lg font-bold mb-2 text-green-700">
              Delete Tinter?
            </h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this tinter? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={confirmDeleteTinter}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() =>
                  setConfirmDelete({ open: false, tinterId: null })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[350px] border border-green-100 rounded">
        <table className="min-w-full text-left border border-green-100 backdrop-blur">
          <thead className="bg-green-500 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">Tinter Code</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Updated By</th>
              <th className="px-4 py-2">Updated At</th>
              <th className="px-4 py-2">Add Batches</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/70">
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
                  className="border-t border-green-100 hover:bg-green-50 transition"
                >
                  <td className="px-4 py-2">{tinter.TinterCode}</td>
                  <td className="px-4 py-2">
                    {tinter.IsActive ? (
                      <span className="text-green-700 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {getUsernamebyUserId(tinter.UpdatedBy)}
                  </td>
                  <td className="px-4 py-2">
                    {tinter.UpdatedAt
                      ? formatUtcToLocal(tinter.UpdatedAt)
                      : "--"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedTinter(tinter);
                        setShowBatchForm(true);
                      }}
                      className="p-1 mx-2 text-green-700 hover:text-green-900"
                    >
                      <IoIosAddCircleOutline />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => handleDeleteTinter(tinter.TinterId)}
                        className="p-1 mx-2 text-green-700 hover:text-green-900"
                      >
                        <MdDelete />
                      </button>
                      <button
                        className="p-1 mx-2 text-green-700 hover:text-green-900"
                        onClick={() => {
                          setEditingTinter(tinter);
                          setShowEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TinterTable;
