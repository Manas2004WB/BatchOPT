import React from "react";

const OldVersionRow = ({ expandedRows, sku }) => {
  console.log("HETETETTEYEYEYEY", expandedRows);
  return (
    <>
      {expandedRows[sku.SkuId].map((version, idx) => (
        <tr
          key={version.SkuVersionId}
          className={`border-l border-r border-b border-green-300 bg-green-100 ${
            idx === expandedRows[sku.SkuId].length - 1 ? "rounded-b-lg" : ""
          }`}
        >
          <td className="px-4 py-2 text-center">-</td>
          <td className="px-4 py-2 text-center">{version.SkuRevision}</td>
          <td className="px-4 py-2">{sku.SkuName}</td>
          <td className="px-4 py-2 text-center">
            {version.Batches?.length ?? "-"}
          </td>
          {/* Nested table for Std. Liquid */}
          <td className="px-2 py-1 text-center">
            {version.StdLiquid ? (
              <table className="w-full text-center border border-gray-200 rounded">
                <tbody>
                  <tr>
                    <td className="px-1 py-1 border">
                      {parseFloat(version.StdLiquid.L).toFixed(2) ?? "-"}
                    </td>
                    <td className="px-1 py-1 border">
                      {parseFloat(version.StdLiquid.A).toFixed(2) ?? "-"}
                    </td>
                    <td className="px-1 py-1 border">
                      {parseFloat(version.StdLiquid.B).toFixed(2) ?? "-"}
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
            {version.PanelColor ? (
              <table className="w-full text-center border border-gray-200 rounded">
                <tbody>
                  <tr>
                    <td className="px-1 py-1 border">
                      {parseFloat(version.PanelColor.L).toFixed(2) ?? "-"}
                    </td>
                    <td className="px-1 py-1 border">
                      {parseFloat(version.PanelColor.A).toFixed(2) ?? "-"}
                    </td>
                    <td className="px-1 py-1 border">
                      {parseFloat(version.PanelColor.B).toFixed(2) ?? "-"}
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
            {version.SpectroColor ? (
              <table className="w-full text-center border border-gray-200 rounded">
                <tbody>
                  <tr>
                    <td className="px-1 py-1 border">
                      {parseFloat(version.SpectroColor.L).toFixed(2) ?? "-"}
                    </td>
                    <td className="px-1 py-1 border">
                      {parseFloat(version.SpectroColor.A).toFixed(2) ?? "-"}
                    </td>
                    <td className="px-1 py-1 border">
                      {parseFloat(version.SpectroColor.B).toFixed(2) ?? "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              "-"
            )}
          </td>
          <td className="px-4 py-2 text-center">
            {version.StdTinters?.length > 0 ? (
              <div className="flex flex-wrap gap-1 justify-center">
                {version.StdTinters.map((tinter, idx) => (
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
          <td className="px-4 py-2 text-center">{version.TargetDeltaE}</td>
          <td className="px-4 py-2 text-center">
            {version.UpdatedAt
              ? new Date(version.UpdatedAt).toLocaleDateString()
              : "-"}
          </td>
          <td className="px-4 py-2">{version.Comments ?? "-"}</td>
        </tr>
      ))}
    </>
  );
};

export default OldVersionRow;
