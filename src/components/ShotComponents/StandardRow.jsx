import React from "react";
import { lab2rgb } from "../../utility/lab2rgb";

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
}) => {
  const rgbLiquid = lab2rgb(liquidL, liquidA, liquidB);
  const rgbPanel = lab2rgb(panelL, panelA, panelB);
  const rgbColorimeter = lab2rgb(colorimeterL, colorimeterA, colorimeterB);

  return (
    <>
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
      <tr className="h-5">
        <td className="border-l px-2 py-1 bg-white/70"></td>
        <td className=" px-2 py-1 bg-white/70"></td>
        {/* //Liquid */}
        <td
          className="border-l px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbLiquid.r}, ${rgbLiquid.g}, ${rgbLiquid.b})`,
          }}
        ></td>
        <td
          className=" px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbLiquid.r}, ${rgbLiquid.g}, ${rgbLiquid.b})`,
          }}
        ></td>
        <td
          className=" px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbLiquid.r}, ${rgbLiquid.g}, ${rgbLiquid.b})`,
          }}
        ></td>
        <td
          className="border-r px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbLiquid.r}, ${rgbLiquid.g}, ${rgbLiquid.b})`,
          }}
        ></td>

        {/* //Panel */}
        <td
          className="border-l px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbPanel.r}, ${rgbPanel.g}, ${rgbPanel.b})`,
          }}
        ></td>
        <td
          className=" px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbPanel.r}, ${rgbPanel.g}, ${rgbPanel.b})`,
          }}
        ></td>
        <td
          className=" px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbPanel.r}, ${rgbPanel.g}, ${rgbPanel.b})`,
          }}
        ></td>
        <td
          className="border-r px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbPanel.r}, ${rgbPanel.g}, ${rgbPanel.b})`,
          }}
        ></td>
        {/* //Colorimeter */}
        <td
          className="border-l px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbColorimeter.r}, ${rgbColorimeter.g}, ${rgbColorimeter.b})`,
          }}
        ></td>
        <td
          className=" px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbColorimeter.r}, ${rgbColorimeter.g}, ${rgbColorimeter.b})`,
          }}
        ></td>
        <td
          className=" px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbColorimeter.r}, ${rgbColorimeter.g}, ${rgbColorimeter.b})`,
          }}
        ></td>
        <td
          className="border-r px-2 py-1"
          style={{
            backgroundColor: `rgb(${rgbColorimeter.r}, ${rgbColorimeter.g}, ${rgbColorimeter.b})`,
          }}
        ></td>
        <td className=" px-2 py-1 bg-white/70"></td>
        <td className="border-r px-2 py-1 bg-white/70"></td>
      </tr>
    </>
  );
};

export default StandardRow;
