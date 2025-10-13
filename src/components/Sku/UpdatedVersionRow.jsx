import React from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const UpdatedVersionRow = ({
  expandedRows,
  latestVersion,
  handleToggleExpand,
  sku,
  srNo,
}) => {
  const isExpanded =
    expandedRows[sku.SkuId] && expandedRows[sku.SkuId].length > 0;
  return (
    <tr
      className={`
        cursor-pointer transition
        ${
          isExpanded
            ? "bg-green-200 border-t border-l border-r border-green-300 rounded-t-lg"
            : "hover:bg-green-50 border-t border-green-200"
        }
      `}
      onClick={() => handleToggleExpand(sku.SkuId)}
    >
      <td className="px-4 py-2 text-center ">
        <div className="flex items-center justify-center gap-1">
          {srNo++}
          {isExpanded ? (
            <MdKeyboardArrowUp className="inline-block text-gray-400" />
          ) : (
            <MdKeyboardArrowDown className="inline-block text-green-700" />
          )}
        </div>
      </td>
      <td className="px-4 py-2 text-center">
        {latestVersion.SkuRevision ?? "-"}
      </td>
      <td className="px-4 py-2">{sku.SkuName ?? "-"}</td>

      <td className="px-4 py-2 text-center">
        {latestVersion.Batches ? latestVersion.Batches.length : "-"}
      </td>

      {/* Nested table for Std. Liquid */}
      <td className="px-2 py-1 text-center">
        {latestVersion.StdLiquid ? (
          <table className="w-full text-center border border-gray-200 rounded">
            <tbody>
              <tr>
                <td className="px-1 py-1 border">
                  {parseFloat(latestVersion.StdLiquid.L).toFixed(2) ?? "-"}
                </td>
                <td className="px-1 py-1 border">
                  {parseFloat(latestVersion.StdLiquid.A).toFixed(2) ?? "-"}
                </td>
                <td className="px-1 py-1 border">
                  {parseFloat(latestVersion.StdLiquid.B).toFixed(2) ?? "-"}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          "-"
        )}
      </td>
      {/* Nested table for Panel Color */}
      <td className="px-2 py-1 text-center">
        {latestVersion.PanelColor ? (
          <table className="w-full text-center border border-gray-200 rounded">
            <tbody>
              <tr>
                <td className="px-1 py-1 border">
                  {parseFloat(latestVersion.PanelColor.L).toFixed(2) ?? "-"}
                </td>
                <td className="px-1 py-1 border">
                  {parseFloat(latestVersion.PanelColor.A).toFixed(2) ?? "-"}
                </td>
                <td className="px-1 py-1 border">
                  {parseFloat(latestVersion.PanelColor.B).toFixed(2) ?? "-"}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          "-"
        )}
      </td>
      {/* Nested table for Spectro Color */}
      <td className="px-2 py-1 text-center">
        {latestVersion.SpectroColor ? (
          <table className="w-full text-center border border-gray-200 rounded">
            <tbody>
              <tr>
                <td className="px-1 py-1 border">
                  {parseFloat(latestVersion.SpectroColor.L).toFixed(2) ?? "-"}
                </td>
                <td className="px-1 py-1 border">
                  {parseFloat(latestVersion.SpectroColor.A).toFixed(2) ?? "-"}
                </td>
                <td className="px-1 py-1 border">
                  {parseFloat(latestVersion.SpectroColor.B).toFixed(2) ?? "-"}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          "-"
        )}
      </td>
      <td className="px-4 py-2 text-center">
        {latestVersion.StdTinters?.length > 0 ? (
          <div className="flex flex-wrap gap-1 justify-center">
            {latestVersion.StdTinters.map((tinter, idx) => (
              <span
                key={tinter.TinterCode + idx}
                className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full shadow"
              >
                {tinter.TinterCode}
              </span>
            ))}
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="px-4 py-2 text-center">
        {latestVersion.TargetDeltaE ?? "-"}
      </td>
      <td className="px-4 py-2 text-center">
        {latestVersion.UpdatedAt
          ? new Date(latestVersion.UpdatedAt).toLocaleDateString()
          : "-"}
      </td>
      <td className="px-4 py-2">{latestVersion.Comments ?? "-"}</td>
    </tr>
  );
};

export default UpdatedVersionRow;
