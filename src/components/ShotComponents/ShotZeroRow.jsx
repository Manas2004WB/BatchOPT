import React from "react";
import { skuVersionMeasurements } from "../../Data/SkuMeasurementData";

const ShotZeroRow = ({ skuVersionId, measurements, comments }) => {
  const getMeasured = (type) =>
    measurements.find((m) => m.measurement_type === type)?.measurement_value ??
    "-";
  const getStandard = (type) =>
    skuVersionMeasurements.find(
      (m) => m.sku_version_id === skuVersionId && m.measurement_type === type
    )?.measurement_value ?? "-";
  const delta = (measured, standard) =>
    measured !== "-" && standard !== "-"
      ? (measured - standard).toFixed(2)
      : "-";
  const deltaColor = (measured, standard) =>
    measured !== "-" && standard !== "-"
      ? (measured + standard).toFixed(2)
      : "-";

  // Liquid
  const liquidL = getMeasured("liquid_l");
  const liquidA = getMeasured("liquid_a");
  const liquidB = getMeasured("liquid_b");
  const liquidDelta = delta(liquidL, getStandard("liquid_l"));
  // Panel
  const panelL = getMeasured("panel_l");
  const panelA = getMeasured("panel_a");
  const panelB = getMeasured("panel_b");
  const panelDelta = delta(panelL, getStandard("panel_l"));
  // Colorimeter
  const colorL = getMeasured("delta_colorimeter_l");
  const colorA = getMeasured("delta_colorimeter_a");
  const colorB = getMeasured("delta_colorimeter_b");
  const colorimeterDelta = "-";
  // dE (just show measured value)
  const deltaE = getMeasured("target_delta_e");

  return (
    <tr className="bg-blue-50">
      <td className="border p-2 text-center font-semibold">Shot 0</td>
      <td className="border p-2 text-center">-</td>
      {/* Liquid */}
      <td className="border p-2 text-center">{liquidL}</td>
      <td className="border p-2 text-center">{liquidA}</td>
      <td className="border p-2 text-center">{liquidB}</td>
      <td className="border p-2 text-center">{liquidDelta}</td>
      {/* Panel */}
      <td className="border p-2 text-center">{panelL}</td>
      <td className="border p-2 text-center">{panelA}</td>
      <td className="border p-2 text-center">{panelB}</td>
      <td className="border p-2 text-center">{panelDelta}</td>
      {/* Colorimeter */}
      <td className="border p-2 text-center">{colorL}</td>
      <td className="border p-2 text-center">{colorA}</td>
      <td className="border p-2 text-center">{colorB}</td>
      <td className="border p-2 text-center">{colorimeterDelta}</td>
      {/* Comments */}
      <td className="border p-2 text-center">{comments}</td>
      {/* Actions */}
      <td className="border p-2 text-center">-</td>
    </tr>
  );
};

export default ShotZeroRow;
