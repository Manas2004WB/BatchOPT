import React, { useState, useEffect } from "react";
import { postSkuWithVersionMeasurements } from "../services/skuService";
import { getSkusWithVersionMeasurements } from "../services/skuService";
import { getTinterByPlantId } from "../services/tinterService"; // fetch tinters by plant
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { Toaster, toast } from "sonner";

const AddSkuModal = ({ plantId, user, onClose, onSuccess }) => {
  const [skuMode, setSkuMode] = useState("select"); // "select" or "input"
  const [skuList, setSkuList] = useState([]);
  const [skuCode, setSkuCode] = useState("");
  const [liquid, setLiquid] = useState({ l: "", a: "", b: "" });
  const [panel, setPanel] = useState({ l: "", a: "", b: "" });
  const [spectro, setSpectro] = useState({ l: "", a: "", b: "" });
  const [targetDE, setTargetDE] = useState("");
  const [comments, setComments] = useState("");
  const [tinters, setTinters] = useState([]);
  const [selectedTinters, setSelectedTinters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSkus = async () => {
      try {
        const data = await getSkusWithVersionMeasurements(plantId);
        console.log("Feched Skus:", data);
        setSkuList(data || []);
      } catch (err) {
        console.error("Error fetching SKUs:", err);
        setError("Failed to load SKUs");
      } finally {
        setLoading(false);
      }
    };
    if (plantId) fetchSkus();
  }, [plantId]);

  // fetch tinters for this plant
  useEffect(() => {
    if (plantId) {
      getTinterByPlantId(plantId).then((data) => setTinters(data || []));
    }
  }, [plantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      PlantId: plantId,
      SkuCode: skuCode,
      StdLiquid: {
        L: parseFloat(liquid.l),
        A: parseFloat(liquid.a),
        B: parseFloat(liquid.b),
      },
      PanelColor: {
        L: parseFloat(panel.l),
        A: parseFloat(panel.a),
        B: parseFloat(panel.b),
      },
      SpectroColor: {
        L: parseFloat(spectro.l),
        A: parseFloat(spectro.a),
        B: parseFloat(spectro.b),
      },
      TargetDeltaE: parseFloat(targetDE),
      StdTinters: selectedTinters.map((id) => ({ TinterId: id })), // 👈 important
      Comments: comments,
    };

    try {
      await postSkuWithVersionMeasurements(payload);
      onSuccess();
    } catch (err) {
      console.error("Error creating SKU:", err.response?.data || err);
      alert("Failed to create SKU");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/35 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-cyan-50 rounded-lg shadow-lg p-6 w-[700px]">
        <h2 className="text-lg font-bold mb-4">Add New SKU</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* SKU Code Dropdown/Input Toggle */}
          <div className="flex items-center gap-2 mb-2">
            <label className="font-semibold">SKU Code:</label>
            <button
              type="button"
              className="text-xs px-2 py-1 rounded bg-cyan-100 text-cyan-700 border border-cyan-300 hover:bg-cyan-200"
              onClick={() => {
                setSkuMode(skuMode === "select" ? "input" : "select");
                setSkuCode("");
              }}
            >
              {skuMode === "select" ? "Type New" : "Select Existing"}
            </button>
          </div>
          {skuMode === "select" ? (
            <select
              value={skuCode}
              onChange={(e) => setSkuCode(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">-- Select SKU --</option>
              {skuList.map((sku) => (
                <option key={sku.SkuId} value={sku.SkuName}>
                  {sku.SkuName}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Type new SKU Code"
              value={skuCode}
              onChange={(e) => setSkuCode(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          )}

          {/* ...existing code... */}
          {/* Liquid L,a,b */}
          <div className="flex gap-2 flex-row">
            {["l", "a", "b"].map((k) => (
              <input
                key={k}
                type="number"
                step="0.01"
                placeholder={`Liquid ${k.toUpperCase()}`}
                value={liquid[k]}
                onChange={(e) =>
                  setLiquid((prev) => ({ ...prev, [k]: e.target.value }))
                }
                className="flex-1 border rounded p-2"
                required
              />
            ))}
          </div>

          {/* Panel L,a,b */}
          <div className="flex gap-2">
            {["l", "a", "b"].map((k) => (
              <input
                key={k}
                type="number"
                step="0.01"
                placeholder={`Panel ${k.toUpperCase()}`}
                value={panel[k]}
                onChange={(e) =>
                  setPanel((prev) => ({ ...prev, [k]: e.target.value }))
                }
                className="flex-1 border rounded p-2"
                required
              />
            ))}
          </div>

          {/* Spectro L,a,b */}
          <div className="flex gap-2">
            {["l", "a", "b"].map((k) => (
              <input
                key={k}
                type="number"
                step="0.01"
                placeholder={`Spectro ${k.toUpperCase()}`}
                value={spectro[k]}
                onChange={(e) =>
                  setSpectro((prev) => ({ ...prev, [k]: e.target.value }))
                }
                className="flex-1 border rounded p-2"
                required
              />
            ))}
          </div>

          {/* Target ΔE */}
          <input
            type="number"
            step="0.01"
            placeholder="Target ΔE"
            value={targetDE}
            onChange={(e) => setTargetDE(e.target.value)}
            className="w-full border rounded p-2"
          />

          {/* Comments */}
          <textarea
            placeholder="Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full border rounded p-2"
          />

          {/* Tinters Multi-select */}
          <div>
            <label className="block font-medium mb-1">Standard Tinters</label>
            <div className="border rounded p-2 bg-gray-50 max-h-25 overflow-y-auto flex flex-col gap-1">
              {tinters.length === 0 ? (
                <span className="text-gray-400">No tinters available</span>
              ) : (
                tinters.map((t) => (
                  <label
                    key={t.TinterId}
                    className="flex items-center gap-2 cursor-pointer hover:bg-cyan-100 rounded px-2 py-1"
                  >
                    <input
                      type="checkbox"
                      value={t.TinterId}
                      checked={selectedTinters.includes(t.TinterId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTinters([...selectedTinters, t.TinterId]);
                        } else {
                          setSelectedTinters(
                            selectedTinters.filter((id) => id !== t.TinterId)
                          );
                        }
                      }}
                      className="accent-cyan-600"
                    />
                    <span className="font-semibold text-cyan-800 text-sm">
                      {t.TinterCode}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkuModal;
