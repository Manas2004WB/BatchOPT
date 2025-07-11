import React, { useState } from "react";
import { tinters as allTinters } from "../Data/TinterData";
import AddTinterForm from "./AddTinterForm";
import { FaEdit } from "react-icons/fa";
import UpdateTinterForm from "./UpdateTinterForm";
import { IoIosAddCircleOutline } from "react-icons/io";
import TinterBatchForm from "./TinterBatchForm";
import { tinterBatches } from "../Data/TinterBatches";

const TinterTable = ({ plantId, user }) => {
  const [editingTinter, setEditingTinter] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tinterList, setTinterList] = useState(allTinters);
  const [selectedTinter, setSelectedTinter] = useState(null); // for batch form
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [allBatches, setAllBatches] = useState(tinterBatches);
  const filteredTinters = tinterList.filter(
    (t) => t.plant_id === Number(plantId)
  );

  const handleUpdateTinter = (updatedTinter) => {
    setTinterList((prevTinters) =>
      prevTinters.map((tinter) =>
        tinter.tinter_id === updatedTinter.tinter_id ? updatedTinter : tinter
      )
    );
    setShowEditModal(false);
  };

  const handleAddTinter = (newTinter) => {
    const nextId =
      tinterList.length > 0
        ? Math.max(...tinterList.map((t) => t.tinter_id)) + 1
        : 1;

    const newTinterWithId = {
      ...newTinter,
      tinter_id: nextId,
      plant_id: Number(plantId),
    };
    console.log(newTinterWithId);
    setTinterList([...tinterList, newTinterWithId]);
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <button
        className="mb-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded"
        onClick={() => setShowAddModal(true)}
      >
        + Add Tinter
      </button>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>

            {/* Add Plant Form */}
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
      {showEditModal && (
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
              onUpdate={(tinter) => {
                handleUpdateTinter(tinter);
                setShowEditModal(false);
              }}
            />
          </div>
        </div>
      )}
      {showBatchForm && selectedTinter && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-5xl relative">
            {/* Close button */}
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
            <th className="px-4 py-2">Edit tinter</th>
            <th className="px-4 py-2">Add Batches</th>
          </tr>
        </thead>
        <tbody className="bg-white/60">
          {filteredTinters.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No tinter data for this plant.
              </td>
            </tr>
          ) : (
            filteredTinters.map((tinter) => (
              <tr
                key={tinter.tinter_id}
                className="border-t border-white/30 hover:bg-white/80 transition"
              >
                <td className="px-4 py-2">{tinter.tinter_code}</td>
                <td className="px-4 py-2">
                  {tinter.is_active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {typeof tinter.updated_by === "number"
                    ? tinter.updated_by === 1
                      ? "Berger Admin"
                      : tinter.updated_by === 2
                      ? "Berger Operator"
                      : tinter.updated_by === 3
                      ? "Berger Management"
                      : "Unknown User"
                    : tinter.updated_by}
                </td>
                <td className="px-4 py-2">{tinter.updated_at}</td>
                <td className="px-4 py-2 ">
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
                    title="Add/View Batches"
                  >
                    <IoIosAddCircleOutline />
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
