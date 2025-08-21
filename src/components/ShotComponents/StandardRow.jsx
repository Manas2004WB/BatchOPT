import React from "react";
import { standardRecipes } from "../../Data/standardRecipes";
import { tinters } from "../../Data/TinterData";
import { skuVersionMeasurements } from "../../Data/SkuMeasurementData";

const StandardRow = ({ skuVersionId }) => {
  const recipesForSku = standardRecipes.filter(
    (rec) => rec.sku_version_id === skuVersionId
  );

  const tinterDetails = recipesForSku.map((rec) => {
    const tinter = tinters.find((t) => t.tinter_id === rec.tinter_id);
    return tinter
      ? `${tinter.tinter_code}`
      : `Unknown Tinter (${rec.tinter_id})`;
  });

  const getMeasurement = (type) =>
    skuVersionMeasurements.find(
      (m) => m.sku_version_id === skuVersionId && m.measurement_type === type
    )?.measurement_value ?? "-";

  const liquidL = getMeasurement("liquid_l");
  const liquidA = getMeasurement("liquid_a");
  const liquidB = getMeasurement("liquid_b");
  const liquidDelta = "-";
  const panelL = getMeasurement("panel_l");
  const panelA = getMeasurement("panel_a");
  const panelB = getMeasurement("panel_b");
  const panelDelta = "-";
  const colorimeterL = getMeasurement("colorimeter_l");
  const colorimeterA = getMeasurement("colorimeter_a");
  const colorimeterB = getMeasurement("colorimeter_b");
  const colorimeterDelta = "-";
  const targetDeltaE = getMeasurement("target_delta_e");

  return (
    <tr className="bg-yellow-50">
      <td className="border p-2 font-semibold text-center">Standard</td>
      <td className="border p-2 text-center">
        <ul className="list-disc list-inside text-xs">
          {tinterDetails.length > 0 ? (
            tinterDetails.map((t, idx) => <li key={idx}>{t}</li>)
          ) : (
            <li>No standard tinters found</li>
          )}
        </ul>
      </td>
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
      <td className="border p-2 text-center">{colorimeterL}</td>
      <td className="border p-2 text-center">{colorimeterA}</td>
      <td className="border p-2 text-center">{colorimeterB}</td>
      <td className="border p-2 text-center">{colorimeterDelta}</td>
      {/* Comments */}
      <td className="border p-2 text-center">Standard reference</td>
      {/* Actions */}
      <td className="border p-2 text-center">-</td>
    </tr>
  );
};

export default StandardRow;
