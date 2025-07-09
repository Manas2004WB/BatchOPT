import React, { useState } from "react";
import { tinters as allTinters } from "../Data/TinterData";
import AddTinterForm from "./AddTinterForm";

const TinterTable = ({ plantId, user }) => {
  const getUsernameFromId = (id) => {
    const map = {
      1: "Berger Admin",
      2: "Berger Operator",
      3: "Berger Management",
    };
    return map[id] || "Unknown User";
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [tinterList, setTinterList] = useState(allTinters);
  const filteredTinters = tinterList.filter(
    (t) => t.plant_id === Number(plantId)
  );

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
      <table className="min-w-full text-left border border-white/30 backdrop-blur">
        <thead className="bg-cyan-700 text-white sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2">Tinter Code</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Updated By</th>
            <th className="px-4 py-2">Updated At</th>
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TinterTable;
