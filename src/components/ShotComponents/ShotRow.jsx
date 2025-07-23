import React from "react";

const ShotRow = ({
  shot,
  handleOpenTinterModal,
  handleColorimeterChange,
  handleCommentChange,
  handleFetch,
  handleEndShot,
}) => (
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
          {shot.tinters && (
            <div className="text-xs text-gray-700">
              {shot.tinters.join(", ")}
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
    <td className="border px-2 py-1">
      {shot.values.deltaE_colorimeter ?? "-"}
    </td>
    <td className="border px-2 py-1 w-48">
      <textarea
        className="w-full border p-1 text-xs"
        placeholder="Add comment..."
        value={shot.comment}
        disabled={shot.ended}
        rows={8}
        onChange={(e) => handleCommentChange(shot.id, e.target.value)}
      ></textarea>
    </td>
    <td className="border px-2 py-1 align-top">
      <div className="flex flex-col gap-2">
        <button
          className="bg-cyan-700 text-white px-2 py-1 rounded"
          onClick={() => handleFetch(shot.id, "liquid")}
          disabled={shot.ended}
        >
          Fetch Liquid
        </button>
        <button
          className="bg-cyan-700 text-white px-2 py-1 rounded"
          onClick={() => handleFetch(shot.id, "panel")}
          disabled={shot.ended}
        >
          Fetch Panel
        </button>
        <button
          className="bg-cyan-600 text-white px-2 py-1 rounded"
          onClick={() => handleFetch(shot.id, "colorimeter")}
          disabled={shot.ended}
        >
          Calculate ΔE
        </button>
        {!shot.ended && (
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
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
);

export default ShotRow;
