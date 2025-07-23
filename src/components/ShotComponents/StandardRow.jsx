import React from "react";

const StandardRow = ({
  recipeTinters,
  liquidL,
  liquidA,
  liquidB,
  targetDeltaE,
  panelL,
  panelA,
  panelB,
  colorimeterL,
  colorimeterA,
  colorimeterB,
}) => (
  <tr className="hover:bg-white/80 transition bg-white/70 text-black">
    <td className="border px-2 py-1">Standard</td>
    <td className="border px-2 py-1">
      {recipeTinters.length ? recipeTinters.join(", ") : "N/A"}
    </td>
    {/* Liquid Color */}
    <td className="border px-2 py-1">
      {liquidL !== "-" ? liquidL.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1">
      {liquidA !== "-" ? liquidA.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1">
      {liquidB !== "-" ? liquidB.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1">
      {targetDeltaE !== "-" ? targetDeltaE.toFixed(2) : "-"}
    </td>
    {/* Panel Color */}
    <td className="border px-2 py-1">
      {panelL !== "-" ? panelL.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1">
      {panelA !== "-" ? panelA.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1">
      {panelB !== "-" ? panelB.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1">
      {targetDeltaE !== "-" ? targetDeltaE.toFixed(2) : "-"}
    </td>
    {/* Colorimeter */}
    <td className="border px-2 py-1">
      {colorimeterL !== "-" ? colorimeterL.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1">
      {colorimeterA !== "-" ? colorimeterA.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1">
      {colorimeterB !== "-" ? colorimeterB.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1">
      {targetDeltaE !== "-" ? targetDeltaE.toFixed(2) : "-"}
    </td>
    <td className="border px-2 py-1"></td>
    <td className="border px-2 py-1"></td>
  </tr>
);

export default StandardRow;
