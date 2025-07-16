import React, { useState } from "react";
import heroBg from "../assets/hero-bg.jpg";
import { useParams } from "react-router-dom";
import { batches } from "../Data/Batches"; // <-- import your batch data
import { MdArrowBackIos } from "react-icons/md";
import { skuVersions } from "../Data/SkuVersionData";
import { skuData } from "../Data/SkuData";
import { skuVersionMeasurements } from "../Data/SkuMeasurementData";
import { standardRecipes } from "../Data/standardRecipes";
import { tinters } from "../Data/TinterData";
import NavbarShots from "../components/NavbarShots";

const ShotsPage = () => {
  const [deltaValues, setDeltaValues] = useState(null);
  const [fetched, setFetched] = useState(false);
  const { batchId } = useParams();
  const batch = batches.find((b) => b.batch_id === parseInt(batchId));

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

  const liquidL = getMeasurement("liquid_l").toFixed(2);
  const liquidA = getMeasurement("liquid_a").toFixed(2);
  const liquidB = getMeasurement("liquid_b").toFixed(2);
  const targetDeltaE = getMeasurement("target_delta_e").toFixed(2);

  const recipeTinters = standardRecipes
    .filter((r) => r.sku_version_id === batch?.sku_version_id)
    .map((r) => {
      const tinter = tinters.find((t) => t.tinter_id === r.tinter_id);
      return tinter?.tinter_code || `Tinter-${r.tinter_id}`;
    });

  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  const handleShow = () => {
    const sampleL = parseFloat(getRandomFloat(0, 100).toFixed(2));
    const sampleA = parseFloat(getRandomFloat(-127, 128).toFixed(2));
    const sampleB = parseFloat(getRandomFloat(-127, 128).toFixed(2));

    const deltaL = parseFloat(liquidL) - sampleL;
    const deltaA = parseFloat(liquidA) - sampleA;
    const deltaB = parseFloat(liquidB) - sampleB;

    const deltaE = Math.sqrt(deltaL ** 2 + deltaA ** 2 + deltaB ** 2);

    setDeltaValues({ deltaL, deltaA, deltaB, deltaE });
    setFetched(true);
  };

  return (
    <div
      className="w-full min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <NavbarShots batch={batch} />

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
            <td className="px-4 py-2">Actions</td>
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
              <td className="px-4 py-2 "></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
            </tr>
            <tr className="border-t border-white/30 hover:bg-white/80 transition bg-white/70 text-black">
              <td className="px-4 py-2 font-semibold">Shot 0</td>
              <td className="px-4 py-2 font-semibold"></td>
              <td className="px-4 py-2  items-center justify-center">
                {!fetched ? (
                  <button
                    className="bg-cyan-600 p-1.5 text-white rounded-md hover:bg-cyan-700"
                    onClick={() => setTimeout(handleShow, 2000)}
                  >
                    Fetch
                  </button>
                ) : (
                  <div className="flex gap-2 text-sm font-medium ">
                    <div className=" px-3 py-1 rounded-full shadow-sm">
                      ΔL: {deltaValues?.deltaL.toFixed(2)}
                    </div>
                    <div className=" px-3 py-1 rounded-full shadow-sm">
                      ΔA: {deltaValues?.deltaA.toFixed(2)}
                    </div>
                    <div className=" px-3 py-1 rounded-full shadow-sm">
                      ΔB: {deltaValues?.deltaB.toFixed(2)}
                    </div>
                  </div>
                )}
              </td>
              <td className="px-4 py-2 ">
                {fetched ? (
                  <div className=" px-1.5 py-1 rounded-full shadow-sm">
                    ΔE: {Number(deltaValues.deltaE).toFixed(2)}
                  </div>
                ) : (
                  <div></div>
                )}
              </td>

              <td className="px-4 py-2 font-semibold"></td>
              <td className="px-4 py-2 font-semibold"></td>
            </tr>
          </tbody>
        </table>
        <button className="bg-cyan-700 p-1.5">ADD SHOT</button>
      </div>
    </div>
  );
};

export default ShotsPage;
