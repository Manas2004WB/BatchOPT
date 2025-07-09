import React, { useState } from "react";
import { skuData as allSkus } from "../Data/SkuData";
import AddTinterForm from "./AddTinterForm";
import AddSkuForm from "./AddSkuForm";

const SkuTable = ({ plantId, user }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [skuList, setSkuList] = useState(allSkus);

  const filteredSku = skuList.filter((s) => s.plant_id === Number(plantId));

  const handleAddSku = (newSku) => {
    const nextId =
      skuList.length > 0 ? Math.max(...skuList.map((s) => s.sku_id)) + 1 : 1;

    const newSkuWithId = {
      ...newSku,
      sku_id: nextId,
      plant_id: Number(plantId),
    };
    console.log(newSku);
    setSkuList([...skuList, newSkuWithId]);
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <button
        className="mb-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded"
        onClick={() => setShowAddModal(true)}
      >
        + Add SKU
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
            <AddSkuForm
              user={user}
              plantId={plantId}
              onAdd={(sku) => {
                handleAddSku(sku);
                setShowAddModal(false);
              }}
            />
          </div>
        </div>
      )}
      <table className="min-w-full text-left border border-white/30 backdrop-blur">
        <thead className="bg-cyan-700 text-white sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2">Sku Name</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Updated By</th>
            <th className="px-4 py-2">Updated At</th>
          </tr>
        </thead>
        <tbody className="bg-white/60">
          {filteredSku.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No Sku data for this plant.
              </td>
            </tr>
          ) : (
            filteredSku.map((sku) => (
              <tr
                key={sku.sku_id}
                className="border-t border-white/30 hover:bg-white/80 transition"
              >
                <td className="px-4 py-2">{sku.sku_name}</td>
                <td className="px-4 py-2">
                  {sku.is_active ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Inactive</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {typeof sku.updated_by === "number"
                    ? sku.updated_by === 1
                      ? "Berger Admin"
                      : sku.updated_by === 2
                      ? "Berger Operator"
                      : sku.updated_by === 3
                      ? "Berger Management"
                      : "Unknown User"
                    : sku.updated_by}
                </td>
                <td className="px-4 py-2">{sku.updated_at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SkuTable;
