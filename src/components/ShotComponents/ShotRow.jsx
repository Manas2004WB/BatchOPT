import React from "react";
import { skuVersionMeasurements } from "../../Data/SkuMeasurementData";
import { tinters } from "../../Data/TinterData";

const ShotRow = ({
  shotNumber,
  skuVersionId,
  measurements,
  comments,
  tinterBatchIds,
  actionCell,
  isNew,
  calInputs,
  onCalInputChange,
  onCalculateDeltaE,
  colorimeterDeltaE,
  colorInputsDisabled,
  showSelectTinterButton,
  showFetchLiquidButton,
  showFetchPanelButton,
}) => {
  // Helper to get measured value
  const getMeasured = (type) =>
    measurements.find((m) => m.measurement_type === type)?.measurement_value ??
    "-";

  // Helper to get standard value
  const getStandard = (type) =>
    skuVersionMeasurements.find(
      (m) => m.sku_version_id === skuVersionId && m.measurement_type === type
    )?.measurement_value ?? "-";

  // Calculate deltas for liquid, panel, and colorimeter
  const delta = (measured, standard) =>
    measured !== "-" && standard !== "-"
      ? (measured - standard).toFixed(2)
      : "-";

  const euclideanDelta = (
    measuredL,
    measuredA,
    measuredB,
    standardL,
    standardA,
    standardB
  ) => {
    if (
      [
        measuredL,
        measuredA,
        measuredB,
        standardL,
        standardA,
        standardB,
      ].includes("-")
    )
      return "-";
    const dL = measuredL - standardL;
    const dA = measuredA - standardA;
    const dB = measuredB - standardB;
    return Math.sqrt(dL * dL + dA * dA + dB * dB).toFixed(2);
  };
  // Liquid
  const liquidL = getMeasured("liquid_l");
  const liquidA = getMeasured("liquid_a");
  const liquidB = getMeasured("liquid_b");
  const liquidDelta = euclideanDelta(
    liquidL,
    liquidA,
    liquidB,
    getStandard("liquid_l"),
    getStandard("liquid_a"),
    getStandard("liquid_b")
  );

  // Panel
  const panelL = getMeasured("panel_l");
  const panelA = getMeasured("panel_a");
  const panelB = getMeasured("panel_b");
  const panelDelta = euclideanDelta(
    panelL,
    panelA,
    panelB,
    getStandard("panel_l"),
    getStandard("panel_a"),
    getStandard("panel_b")
  );

  // Colorimeter
  const colorL = getMeasured("delta_colorimeter_l");
  const colorA = getMeasured("delta_colorimeter_a");
  const colorB = getMeasured("delta_colorimeter_b");
  const colorDelta = euclideanDelta(
    colorL,
    colorA,
    colorB,
    getStandard("colorimeter_l"),
    getStandard("colorimeter_a"),
    getStandard("colorimeter_b")
  );

  const colorLDisplay = isNew ? (
    <input
      type="number"
      placeholder="L"
      value={calInputs?.l || ""}
      onChange={(e) => onCalInputChange("l", e.target.value)}
      className="border w-10 px-1 text-xs"
      disabled={colorInputsDisabled}
    />
  ) : (
    delta(colorL, getStandard("colorimeter_l"))
  );
  const colorADisplay = isNew ? (
    <input
      type="number"
      placeholder="a"
      value={calInputs?.a || ""}
      onChange={(e) => onCalInputChange("a", e.target.value)}
      className="border w-10 px-1 text-xs"
      disabled={colorInputsDisabled}
    />
  ) : (
    delta(colorA, getStandard("colorimeter_a"))
  );
  const colorBDisplay = isNew ? (
    <input
      type="number"
      placeholder="b"
      value={calInputs?.b || ""}
      onChange={(e) => onCalInputChange("b", e.target.value)}
      className="border w-10 px-1 text-xs"
      disabled={colorInputsDisabled}
    />
  ) : (
    delta(colorB, getStandard("colorimeter_b"))
  );

  const colorimeterDeltaECell = isNew
    ? colorDelta
    : getMeasured("target_delta_e") ?? "-";

  // Get tinter codes for this shot
  const tinterCodes = tinterBatchIds.map((tbid, idx) => {
    const tinter = tinters.find((t) => t.tinter_id === tbid);
    return tinter ? tinter.tinter_code : `Unknown (${tbid})`;
  });

  // Only show values if fetched
  const showLiquid =
    !isNew ||
    (isNew && measurements.some((m) => m.measurement_type === "liquid_l"));
  const showPanel =
    !isNew ||
    (isNew && measurements.some((m) => m.measurement_type === "panel_l"));

  // ...existing code...

  return (
    <tr>
      <td className="border p-2 text-center">{shotNumber}</td>
      <td className="border p-2 text-center">
        {showSelectTinterButton}
        {tinterCodes.length > 0 && (
          <ul className="list-disc list-inside text-xs">
            {tinterCodes.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        )}
      </td>
      {/* Liquid */}
      <td className="border p-2 text-center">
        {showLiquid ? delta(liquidL, getStandard("liquid_l")) : "-"}
      </td>
      <td className="border p-2 text-center">
        {showLiquid ? delta(liquidA, getStandard("liquid_a")) : "-"}
      </td>
      <td className="border p-2 text-center">
        {showLiquid ? delta(liquidB, getStandard("liquid_b")) : "-"}
      </td>
      <td className="border p-2 text-center">
        {showLiquid ? liquidDelta : "-"}
      </td>

      {/* Panel */}
      <td className="border p-2 text-center">
        {showPanel ? delta(panelL, getStandard("panel_l")) : "-"}
      </td>
      <td className="border p-2 text-center">
        {showPanel ? delta(panelA, getStandard("panel_a")) : "-"}
      </td>
      <td className="border p-2 text-center">
        {showPanel ? delta(panelB, getStandard("panel_b")) : "-"}
      </td>
      <td className="border p-2 text-center">{showPanel ? panelDelta : "-"}</td>

      {/* Colorimeter */}
      <td className="border p-2 text-center">{colorLDisplay}</td>
      <td className="border p-2 text-center">{colorADisplay}</td>
      <td className="border p-2 text-center">{colorBDisplay}</td>
      <td className="border p-2 text-center">{colorimeterDeltaECell}</td>

      {/* Comments */}
      <td className="border p-2 text-center">{comments}</td>
      {/* Actions */}
      <td className="border p-2 text-center">{actionCell}</td>
    </tr>
  );
};

export default ShotRow;
