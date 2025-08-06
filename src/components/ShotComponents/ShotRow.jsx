import React, { useState } from "react";
import { lab2rgb } from "../../utility/lab2rgb";
import { tinters } from "../../Data/TinterData";
import { tinterBatches } from "../../Data/TinterBatches";
const ShotRow = ({
  shot,
  handleOpenTinterModal,
  handleColorimeterChange,
  handleCommentChange,
  handleFetch,
  handleEndShot,
  colorimeterL,
  colorimeterA,
  colorimeterB,
  randomLLiquid,
  randomALiquid,
  randomBLiquid,
  randomLPanel,
  randomAPanel,
  randomBPanel,
}) => {
  const [visibleSections, setVisibleSections] = useState({
    liquid: false,
    panel: false,
    colorimeter: false,
  });

  // Handle button clicks
  const showSection = (type) => {
    setVisibleSections((prev) => ({ ...prev, [type]: true }));
    handleFetch(shot.id, type);
  };

  const rgbLiquid = lab2rgb(randomLLiquid, randomALiquid, randomBLiquid);
  const rgbPanel = lab2rgb(randomLPanel, randomAPanel, randomBPanel);
  const rgbColorimeter = lab2rgb(
    shot.values.l_colorimeter + colorimeterL,
    shot.values.a_colorimeter + colorimeterA,
    shot.values.b_colorimeter + colorimeterB
  );
  return (
    <>
      <tr className="border-t border-white/30 hover:bg-white/80 transition bg-white/70 text-black">
        <td className="border px-2 py-1 font-semibold">Shot {shot.id}</td>
        <td className="border px-2 py-1 align-top">
          {shot.id > 0 ? (
            <div>
              <button
                className="bg-cyan-600 text-white px-2 py-1 rounded mr-2 mb-1"
                onClick={() => handleOpenTinterModal(shot.id)}
                disabled={shot.ended}
              >
                {shot.tinters ? "Re-select Tinters" : "Select Tinters"}
              </button>
              {shot.tinters &&
                Array.isArray(shot.tinters) &&
                shot.tinters.length > 0 && (
                  <div className="text-xs text-gray-700">
                    {shot.tinters
                      .map((t) => {
                        // Find tinter code and batch name for display
                        const tinterObj = tinters.find(
                          (x) => x.tinter_id === t.tinter_id
                        );
                        const batchObj = tinterBatches.find(
                          (b) => b.tinter_batch_id === t.batch_id
                        );
                        const tinterCode =
                          tinterObj?.tinter_code || `Tinter-${t.tinter_id}`;
                        const batchCode =
                          batchObj?.batch_tinter_name || `Batch-${t.batch_id}`;
                        return `${tinterCode} - ${batchCode}`;
                      })
                      .join(", ")}
                  </div>
                )}
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
        {/* Liquid Color */}
        <td className="border px-2 py-1">{shot.values.l_liquid ?? "-"}</td>
        <td className="border px-2 py-1">{shot.values.a_liquid ?? "-"}</td>
        <td className="border px-2 py-1">{shot.values.b_liquid ?? "-"}</td>
        <td className="border px-2 py-1">{shot.values.deltaE_liquid ?? "-"}</td>
        {/* Panel Color */}
        <td className="border px-2 py-1">{shot.values.l_panel ?? "-"}</td>
        <td className="border px-2 py-1">{shot.values.a_panel ?? "-"}</td>
        <td className="border px-2 py-1">{shot.values.b_panel ?? "-"}</td>
        <td className="border px-2 py-1">{shot.values.deltaE_panel ?? "-"}</td>
        {/* Colorimeter */}
        <td className="border px-2 py-1">
          <input
            type="number"
            step="0.01"
            className="w-16 text-xs p-1 border rounded"
            value={shot.values.l_colorimeter ?? ""}
            disabled={shot.ended}
            onChange={(e) =>
              handleColorimeterChange(shot.id, "l_colorimeter", e.target.value)
            }
          />
        </td>
        <td className="border px-2 py-1">
          <input
            type="number"
            step="0.01"
            className="w-16 text-xs p-1 border rounded"
            value={shot.values.a_colorimeter ?? ""}
            disabled={shot.ended}
            onChange={(e) =>
              handleColorimeterChange(shot.id, "a_colorimeter", e.target.value)
            }
          />
        </td>
        <td className="border px-2 py-1">
          <input
            type="number"
            step="0.01"
            className="w-16 text-xs p-1 border rounded"
            value={shot.values.b_colorimeter ?? ""}
            disabled={shot.ended}
            onChange={(e) =>
              handleColorimeterChange(shot.id, "b_colorimeter", e.target.value)
            }
          />
        </td>
        <td className="px-2 py-1 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <span>{shot.values.deltaE_colorimeter ?? "-"}</span>
            {!shot.ended && (
              <button
                className="bg-cyan-700 text-white px-2 py-1 rounded"
                onClick={() => showSection("colorimeter")}
              >
                Calculate ΔE
              </button>
            )}
          </div>
        </td>

        <td className="border px-2 py-1 w-48">
          <textarea
            className="w-full border p-1 text-xs"
            placeholder="Add comment..."
            value={shot.comment}
            disabled={shot.ended}
            onChange={(e) => handleCommentChange(shot.id, e.target.value)}
          ></textarea>
        </td>
        <td className="border px-2 py-1 align-top">
          <div className="flex flex-col gap-2">
            <button
              className={
                !shot.ended
                  ? "bg-cyan-700 text-white px-2 py-1 rounded"
                  : "invisible"
              }
              onClick={() => showSection("liquid")}
              disabled={shot.ended}
            >
              Fetch Liquid
            </button>
            <button
              className={
                !shot.ended
                  ? "bg-cyan-700 text-white px-2 py-1 rounded"
                  : "invisible"
              }
              onClick={() => showSection("panel")}
              disabled={shot.ended}
            >
              Fetch Panel
            </button>

            {!shot.ended && (
              <button
                className={
                  !shot.ended
                    ? "bg-red-700 text-white px-2 py-1 rounded"
                    : "invisible"
                }
                onClick={() => handleEndShot(shot.id)}
              >
                End Shot
              </button>
            )}
            {shot.ended && (
              <span className="text-green-600 font-semibold text-xs">
                Shot Ended
              </span>
            )}
          </div>
        </td>
      </tr>
      {(visibleSections.liquid ||
        visibleSections.panel ||
        visibleSections.colorimeter) && (
        <tr className="h-5">
          <td className="border-l px-2 py-1 bg-white/70"></td>
          <td className="px-2 py-1 bg-white/70"></td>

          {/* Liquid cells */}
          {["r", "g", "b", "extra"].map((_, i) => (
            <td
              key={`liquid-${i}`}
              style={{
                backgroundColor: visibleSections.liquid
                  ? `rgb(${rgbLiquid.r}, ${rgbLiquid.g}, ${rgbLiquid.b})`
                  : "transparent",
              }}
              className={`${i === 0 ? "border-l" : ""} ${
                i === 3 ? "border-r" : ""
              }`}
            ></td>
          ))}

          {/* Panel cells */}
          {["r", "g", "b", "extra"].map((_, i) => (
            <td
              key={`panel-${i}`}
              style={{
                backgroundColor: visibleSections.panel
                  ? `rgb(${rgbPanel.r}, ${rgbPanel.g}, ${rgbPanel.b})`
                  : "transparent",
              }}
              className={`${i === 0 ? "border-l" : ""} ${
                i === 3 ? "border-r" : ""
              }`}
            ></td>
          ))}

          {/* Colorimeter cells */}
          {["r", "g", "b", "extra"].map((_, i) => (
            <td
              key={`colorimeter-${i}`}
              style={{
                backgroundColor: visibleSections.colorimeter
                  ? `rgb(${rgbColorimeter.r}, ${rgbColorimeter.g}, ${rgbColorimeter.b})`
                  : "transparent",
              }}
              className={`${i === 0 ? "border-l" : ""} ${
                i === 3 ? "border-r" : ""
              }`}
            ></td>
          ))}

          <td className="px-2 py-1 bg-white/70"></td>
          <td className="border-r px-2 py-1 bg-white/70"></td>
        </tr>
      )}
    </>
  );
};

export default ShotRow;
