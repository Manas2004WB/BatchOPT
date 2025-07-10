import React, { useState } from "react";
import { tinters } from "../Data/TinterData";
import Select from "react-select";

const UpdateSkuForm = ({ plantId, skuToEdit, onUpdate }) => {
  const getTinterIdsFromCodes = (codes) => {
    return plantTinters
      .filter((t) => codes.includes(t.tinter_code))
      .map((t) => t.tinter_id);
  };
  const plantTinters = tinters.filter((t) => t.plant_id == Number(plantId));
  const [sku, setSku] = useState({
    skuName: skuToEdit?.skuName || "",
    version: skuToEdit?.skuRevision || 1,
    comments: skuToEdit?.comments || "",
    standardLiquid: skuToEdit?.standardLiquid || { L: "", a: "", b: "" },
    standardPanel: skuToEdit?.standardPanel || { L: "", a: "", b: "" },
    spectroPanel: skuToEdit?.spectroPanel || { L: "", a: "", b: "" },
    standardTinterIds: getTinterIdsFromCodes(skuToEdit?.standardTinters || []),
    targetDeltaE: skuToEdit?.targetDeltaE || "",
  });

  const tinterOptions = plantTinters.map((tinter) => ({
    value: tinter.tinter_id,
    label: tinter.tinter_code,
  }));
  console.log(tinterOptions);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sku.skuName.trim()) {
      return setError("SKU Code is required");
    }

    const selectedCodes = plantTinters
      .filter((t) => sku.standardTinterIds.includes(t.tinter_id))
      .map((t) => t.tinter_code);

    const now = new Date().toISOString();

    const parseColor = (colorGroup) => ({
      L: parseFloat(colorGroup.L) || 0,
      a: parseFloat(colorGroup.a) || 0,
      b: parseFloat(colorGroup.b) || 0,
    });

    const newSkuObject = {
      ...skuToEdit,
      skuRevision: Number(skuToEdit.skuRevision) + 1, // increase version
      skuName: sku.skuName.trim(),
      batches: "Static",
      standardLiquid: parseColor(sku.standardLiquid),
      standardPanel: parseColor(sku.standardPanel),
      spectroPanel: parseColor(sku.spectroPanel),
      standardTinters: selectedCodes,
      targetDeltaE: sku.targetDeltaE || "-",
      createdOn: formatDisplayDate(now), // new version = new createdOn
      lastUpdated: formatDisplayDate(now),
      comments: sku.comments || "-",
    };

    onUpdate(newSkuObject);
    setSku({ skuName: "", version: 1, comments: "" });
    setError("");
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white/30 backdrop-blur-md p-2 rounded-lg shadow space-y-3 text-sm"
    >
      <h2 className="text-base font-semibold text-black mb-2">Edit SKU</h2>

      {error && (
        <p className="text-red-600 bg-white/60 px-2 py-1 rounded text-xs">
          {error}
        </p>
      )}

      {/* SKU Code & Revision */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="SKU Code"
          value={sku.skuName}
          onChange={(e) => setSku({ ...sku, skuName: e.target.value })}
          className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
        />
        <p className="text-medium border-2 text-gray-600">
          Product Type : GI-Metallic
        </p>
      </div>

      {/* Standard Liquid */}
      <div>
        <label className="text-xs text-black mb-1 block">
          Standard Liquid (L, a, b)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["L", "a", "b"].map((key) => (
            <input
              key={`liquid-${key}`}
              type="number"
              step="0.01"
              placeholder={key}
              value={sku.standardLiquid[key]}
              onChange={(e) =>
                setSku({
                  ...sku,
                  standardLiquid: {
                    ...sku.standardLiquid,
                    [key]: e.target.value,
                  },
                })
              }
              className="px-2 py-1 rounded border border-gray-300 text-sm"
            />
          ))}
        </div>
      </div>

      {/* Panel Color */}
      <div>
        <label className="text-xs text-black mb-1 block">
          Panel Color (L, a, b)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["L", "a", "b"].map((key) => (
            <input
              key={`panel-${key}`}
              type="number"
              step="0.01"
              placeholder={key}
              value={sku.standardPanel[key]}
              onChange={(e) =>
                setSku({
                  ...sku,
                  standardPanel: {
                    ...sku.standardPanel,
                    [key]: e.target.value,
                  },
                })
              }
              className="px-2 py-1 rounded border border-gray-300 text-sm"
            />
          ))}
        </div>
      </div>

      {/* Spectro Panel */}
      <div>
        <label className="text-xs text-black mb-1 block">
          Spectro Panel (L, a, b)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["L", "a", "b"].map((key) => (
            <input
              key={`spectro-${key}`}
              type="number"
              step="0.01"
              placeholder={key}
              value={sku.spectroPanel[key]}
              onChange={(e) =>
                setSku({
                  ...sku,
                  spectroPanel: {
                    ...sku.spectroPanel,
                    [key]: e.target.value,
                  },
                })
              }
              className="px-2 py-1 rounded border border-gray-300 text-sm"
            />
          ))}
        </div>
      </div>

      {/* Standard Tinters */}
      <div className="mb-4">
        <label className="text-xs text-black mb-1 block">
          Standard Tinters
        </label>
        <Select
          isMulti
          options={tinterOptions}
          value={tinterOptions.filter((opt) =>
            sku.standardTinterIds.includes(opt.value)
          )}
          onChange={(selectedOptions) =>
            setSku({
              ...sku,
              standardTinterIds: selectedOptions.map((opt) => opt.value),
            })
          }
          className="text-sm"
          classNamePrefix="select"
          placeholder="Select tinters..."
        />
      </div>

      {/* Target dE & Comments */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-black mb-1 block">Target dE</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g., 1.50"
            value={sku.targetDeltaE}
            onChange={(e) => setSku({ ...sku, targetDeltaE: e.target.value })}
            className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-black mb-1 block">Comments</label>
          <textarea
            placeholder="Optional"
            rows={1}
            value={sku.comments}
            onChange={(e) => setSku({ ...sku, comments: e.target.value })}
            className="w-full px-2 py-1 rounded border border-gray-300 text-sm"
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-1.5 rounded text-sm"
      >
        Update SKU
      </button>
    </form>
  );
};

export default UpdateSkuForm;
