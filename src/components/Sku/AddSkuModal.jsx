import React, { useState, useEffect } from "react";
import { postSkuWithVersionMeasurements } from "../../services/skuService";
import { getSkusWithVersionMeasurements } from "../../services/skuService";
import { getTinterByPlantId } from "../../services/tinterService"; // fetch tinters by plant
import { Toaster, toast } from "sonner";

const AddSkuModal = ({ plantId, user, onClose, onSuccess }) => {
  const [tinterSearch, setTinterSearch] = useState("");
  // Helper to generate random value within range
  const randomInRange = (min, max) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  // Ranges for L, a, b (adjust as needed)
  const liquidRanges = { l: [0, 100], a: [-128, 128], b: [-128, 128] };
  const panelRanges = { l: [0, 100], a: [-128, 128], b: [-128, 128] };

  // Fetch random values for Liquid
  const fetchRandomLiquid = () => {
    setLiquid({
      l: randomInRange(...liquidRanges.l),
      a: randomInRange(...liquidRanges.a),
      b: randomInRange(...liquidRanges.b),
    });
  };

  // Fetch random values for Panel
  const fetchRandomPanel = () => {
    setPanel({
      l: randomInRange(...panelRanges.l),
      a: randomInRange(...panelRanges.a),
      b: randomInRange(...panelRanges.b),
    });
  };
  const [skuMode, setSkuMode] = useState("input"); // "select" or "input"
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

  const validateForm = () => {
    // SKU Code
    if (!skuCode) {
      toast.error("SKU Code is required");
      return false;
    }
    if (skuCode.length > 30) {
      toast.error("SKU Code must not exceed 30 characters");
      return false;
    }
    if (!/^(?! )[A-Za-z0-9- ]*(?<! )$/.test(skuCode)) {
      toast.error(
        "SKU Code can contain letters, numbers, '-', spaces (but not at start/end)"
      );
      return false;
    }

    // Validate ranges (Liquid, Panel, Spectro/Colorimeter)
    const validateRange = (value, min, max, label) => {
      if (value === "" || isNaN(value)) {
        toast.error(`${label} is required`);
        return false;
      }
      if (value < min || value > max) {
        toast.error(`${label} must be between ${min} and ${max}`);
        return false;
      }
      return true;
    };

    if (
      !validateRange(liquid.l, 0, 100, "Liquid L") ||
      !validateRange(liquid.a, -128, 128, "Liquid a") ||
      !validateRange(liquid.b, -128, 128, "Liquid b") ||
      !validateRange(panel.l, 0, 100, "Panel L") ||
      !validateRange(panel.a, -128, 128, "Panel a") ||
      !validateRange(panel.b, -128, 128, "Panel b") ||
      !validateRange(spectro.l, 0, 100, "Spectro L") ||
      !validateRange(spectro.a, -128, 128, "Spectro a") ||
      !validateRange(spectro.b, -128, 128, "Spectro b")
    ) {
      return false;
    }

    // Target ΔE
    if (targetDE === "" || isNaN(targetDE)) {
      toast.error("Target ΔE is required");
      return false;
    }
    if (targetDE < 0 || targetDE >= 10) {
      toast.error("Target ΔE must be between 0 and 10 (exclusive of 10)");
      return false;
    }

    // Comments
    if (comments.length > 100) {
      toast.error("Comments must be less than 100 characters");
      return false;
    }

    // Tinters
    if (selectedTinters.length === 0) {
      toast.error("At least one Standard Tinter must be selected");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const payload = {
      PlantId: plantId,
      SkuCode: skuCode.trim(),
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
      Comments: comments.trim(),
    };

    try {
      await postSkuWithVersionMeasurements(payload);
      onSuccess();
      toast.success("SKU created successfully");
    } catch (err) {
      console.error("Error creating SKU:", err.response?.data || err);
      alert("Failed to create SKU");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400/10 backdrop-blur-sm flex justify-center items-center z-50">
      <Toaster position="top-right" richColors />
      <div className="bg-white rounded-lg shadow-lg p-6 w-[900px]">
        <h2 className="text-lg font-bold mb-2">
          {skuMode === "select" ? "Create new SKU Version" : "Create new SKU"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-1">
          {/* SKU Code Dropdown/Input Toggle */}
          <div className="flex items-center gap-2 mb-3">
            <label className="font-semibold">SKU Code:</label>
            <button
              type="button"
              className="text-xs px-2 py-1 rounded bg-[#3dcd58] text-white border border-emerald-700 hover:bg-emerald-600"
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
              className="w-full border rounded p-1"
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
              className="w-full border rounded p-1"
              required
            />
          )}

          {/* ...existing code... */}
          {/* Liquid L,a,b + Fetch Button (visible only if SKU selected/typed) */}
          <div className="flex gap-2 flex-row items-center">
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
                className="flex-1 border rounded p-1"
                required
              />
            ))}
            {skuCode && (
              <button
                type="button"
                onClick={fetchRandomLiquid}
                className="ml-2 px-3 py-1 bg-[#3dcd58] text-white rounded hover:bg-green-700 text-xs font-semibold border border-green-700"
              >
                Fetch
              </button>
            )}
          </div>

          {/* Panel L,a,b + Fetch Button (visible only if SKU selected/typed) */}
          <div className="flex gap-2 items-center">
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
                className="flex-1 border rounded p-1"
                required
              />
            ))}
            {skuCode && (
              <button
                type="button"
                onClick={fetchRandomPanel}
                className="ml-2 px-3 py-1 bg-[#3dcd58] text-white rounded hover:bg-green-700 text-xs font-semibold border border-green-700"
              >
                Fetch
              </button>
            )}
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
                className="flex-1 border rounded p-1"
                required
              />
            ))}
            {skuCode && (
              <button
                type="button"
                className="disable  ml-2 px-3 py-1 bg-white text-white rounded "
              >
                Fetch
              </button>
            )}
          </div>

          {/* Target ΔE */}
          <input
            type="number"
            step="0.01"
            placeholder="Target ΔE"
            value={targetDE}
            onChange={(e) => setTargetDE(e.target.value)}
            className="w-full border rounded p-2"
            required
          />

          {/* Comments */}
          <textarea
            placeholder="Comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full border rounded p-2"
          />

          {/* Tinters Multi-select with Search Filter */}
          <div>
            <label className="block font-medium mb-1">Standard Tinters</label>
            <input
              type="text"
              value={tinterSearch}
              onChange={(e) => setTinterSearch(e.target.value)}
              placeholder="Search tinters..."
              className="mb-2 px-2 py-1 border rounded w-full"
            />
            <div className="border rounded p-2 bg-emerald-50 max-h-25 min-h-25 overflow-y-auto flex flex-col gap-1">
              {tinters.length === 0 ? (
                <span className="text-gray-400">No tinters available</span>
              ) : (
                tinters
                  .filter((t) =>
                    t.TinterCode.toLowerCase().includes(
                      tinterSearch.toLowerCase()
                    )
                  )
                  .map((t) => (
                    <label
                      key={t.TinterId}
                      className="flex items-center gap-1 cursor-pointer hover:bg-emerald-100 rounded px-2 py-1"
                    >
                      <input
                        type="checkbox"
                        value={t.TinterId}
                        checked={selectedTinters.includes(t.TinterId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTinters([
                              ...selectedTinters,
                              t.TinterId,
                            ]);
                          } else {
                            setSelectedTinters(
                              selectedTinters.filter((id) => id !== t.TinterId)
                            );
                          }
                        }}
                        className="accent-emerald-600"
                      />
                      <span className="font-semibold text-emerald-800 text-sm">
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
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
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
