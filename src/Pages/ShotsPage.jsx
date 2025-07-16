import React from "react";
import heroBg from "../assets/hero-bg.jpg";
import { useParams } from "react-router-dom";
import { batches } from "../Data/Batches"; // <-- import your batch data
import { MdArrowBackIos } from "react-icons/md";
import { skuVersions } from "../Data/SkuVersionData";
import { skuData } from "../Data/SkuData";
import { skuVersionMeasurements } from "../Data/SkuMeasurementData";
import { standardRecipes } from "../Data/standardRecipes";
import { tinters } from "../Data/TinterData";

const ShotsPage = () => {
  const { batchId } = useParams();
  const batch = batches.find((b) => b.batch_id === parseInt(batchId));

  const getSkuByVersionId = (versionId) => {
    const version = skuVersions.find((v) => v.sku_version_id === versionId);
    if (!version) return "-";

    const sku = skuData.find((s) => s.sku_id === version.sku_id);
    return sku?.sku_name || "-";
  };
  //Table data
  const skuVersion = skuVersions.find(
    (v) => v.sku_version_id === batch?.sku_version_id
  );
  const measurements = skuVersionMeasurements.filter(
    (m) => m.sku_version_id === batch?.sku_version_id
  );
  const getMeasurement = (type) =>
    measurements.find((m) => m.measurement_type === type)?.measurement_value ??
    "-";

  const liquidL = getMeasurement("liquid_l");
  const liquidA = getMeasurement("liquid_a");
  const liquidB = getMeasurement("liquid_b");
  const targetDeltaE = getMeasurement("target_delta_e");

  const recipeTinters = standardRecipes
    .filter((r) => r.sku_version_id === batch?.sku_version_id)
    .map((r) => {
      const tinter = tinters.find((t) => t.tinter_id === r.tinter_id);
      return tinter?.tinter_code || `Tinter-${r.tinter_id}`;
    });

  return (
    <div
      className="w-full min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Top Info Bar */}
      <div className="bg-white/60 backdrop-blur-md p-4 flex justify-between items-center text-black font-semibold shadow-md">
        <div>
          Batch Code:{" "}
          <span className="text-cyan-800 text-2xl">
            {batch?.batch_code || "-"}
          </span>
        </div>
        <div>
          SKU Version ID:{" "}
          <span className="text-cyan-800 text-xl">
            {getSkuByVersionId(batch?.sku_version_id || "-")}
          </span>
        </div>
        <div>
          Batch Size:{" "}
          <span className="text-cyan-800">{batch?.batch_size || "-"}</span>
        </div>
        <div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 bg-white text-cyan-800 font-medium text-sm px-4 py-1.5 rounded-md shadow hover:bg-gray-100 transition duration-200"
          >
            <MdArrowBackIos className="text-base" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* You can add shots input section below this */}
      <div className="p-6 text-white text-xl">
        {/* For now */}
        <table className="min-w-full text-left border border-white/30 backdrop-blur ">
          <thead className="bg-cyan-700 text-white sticky top-0 z-10">
            <td className="px-4 py-2">Samples</td>
            <td className="px-4 py-2">Tinter Added</td>
            <td className="px-4 py-2">Liquid Color</td>
            <td className="px-4 py-2">Liquid dE</td>
            <td className="px-4 py-2">Comments</td>
          </thead>
          <tbody>
            <tr className="border-t border-white/30 hover:bg-white/80 transition bg-white/70 text-black">
              <td className="px-4 py-2 font-semibold">Standard</td>
              <td className="px-4 py-2 ">
                {recipeTinters.length > 0 ? recipeTinters.join(", ") : "-"}
              </td>
              <td className="px-4 py-2">
                L: {liquidL}, a: {liquidA}, b: {liquidB}
              </td>
              <td className="px-4 py-2 ">{targetDeltaE}</td>
              <td className="px-4 py-2 ">{skuVersion?.comments || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShotsPage;
