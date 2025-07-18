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
import ShotTinterAddModal from "../components/ShotTinterAddModal";

const ShotsPage = () => {
  const [tinterModalShotIndex, setTinterModalShotIndex] = useState(null);
  const [shots, setShots] = useState([]); // Initially empty
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

  const handleFetch = (index) => {
    const sampleL = parseFloat(getRandomFloat(0, 100).toFixed(2));
    const sampleA = parseFloat(getRandomFloat(-127, 128).toFixed(2));
    const sampleB = parseFloat(getRandomFloat(-127, 128).toFixed(2));

    const deltaL = parseFloat(liquidL) - sampleL;
    const deltaA = parseFloat(liquidA) - sampleA;
    const deltaB = parseFloat(liquidB) - sampleB;
    const deltaE = Math.sqrt(deltaL ** 2 + deltaA ** 2 + deltaB ** 2);

    const updated = {
      deltaL: deltaL.toFixed(2),
      deltaA: deltaA.toFixed(2),
      deltaB: deltaB.toFixed(2),
      deltaE: deltaE.toFixed(2),
    };

    const updatedShots = [...shots];
    updatedShots[index].deltaValues = updated;
    updatedShots[index].fetched = true;
    setShots(updatedShots);
  };
  console.log(shots);
  const handleAddShot = () => {
    const nextShotNumber = shots.length;
    const newShot = {
      id: nextShotNumber,
      deltaValues: null,
      fetched: false,
      ended: false,
    };
    setShots((prev) => [...prev, newShot]);
  };
  const handleEndShot = (index) => {
    const updatedShots = [...shots];
    updatedShots[index].ended = true;
    setShots(updatedShots);
  };
  const handleOpenTinterModal = (index) => {
    setTinterModalShotIndex(index);
  };

  const handleCloseTinterModal = () => {
    setTinterModalShotIndex(null);
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
            <tr>
              <th className="px-4 py-2">Samples</th>
              <th className="px-4 py-2">Tinter Added</th>
              <th className="px-4 py-2">Liquid Color</th>
              <th className="px-4 py-2">Liquid dE</th>
              <th className="px-4 py-2">Comments</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
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
            {shots.map((shot, index) => (
              <tr
                key={index}
                className="border-t border-white/30 hover:bg-white/80 transition bg-white/70 text-black"
              >
                <td className="px-4 py-2 font-semibold">Shot {shot.id}</td>
                <td className="px-4 py-2">
                  {/* You can add Select/Manual logic here later for non-zero shots */}
                  <td className="px-4 py-2">
                    {shot.id !== 0 && !shot.ended && (
                      <button
                        className="bg-cyan-600 text-white px-3 py-1 rounded-md hover:bg-cyan-700"
                        onClick={() => handleOpenTinterModal(index)}
                      >
                        Select Tinters
                      </button>
                    )}
                  </td>
                </td>
                <td className="px-4 py-2">
                  {index === 0 && !shot.fetched && !shot.ended ? (
                    <button
                      className="bg-cyan-600 p-1.5 text-white rounded-md hover:bg-cyan-700"
                      onClick={() => {
                        handleFetch(index); // no setTimeout unless you want delay
                      }}
                    >
                      Fetch
                    </button>
                  ) : shot.deltaValues ? (
                    <div className="flex flex-row ">
                      {!shot.ended ? (
                        <button
                          className="bg-cyan-600 p-1.5 text-white rounded-md hover:bg-cyan-700"
                          onClick={() => {
                            setTimeout(() => handleFetch(index), 1000);
                            // no setTimeout unless you want delay
                          }}
                        >
                          Fetch
                        </button>
                      ) : null}

                      <div className="flex gap-2 text-sm font-medium">
                        <div className="px-3 py-1 rounded-full shadow-sm">
                          ΔL: {shot.deltaValues.deltaL}
                        </div>
                        <div className="px-3 py-1 rounded-full shadow-sm">
                          ΔA: {shot.deltaValues.deltaA}
                        </div>
                        <div className="px-3 py-1 rounded-full shadow-sm">
                          ΔB: {shot.deltaValues.deltaB}
                        </div>
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2">
                  {shot.deltaValues ? (
                    <div className="px-2 py-1 rounded-full shadow-sm">
                      ΔE: {shot.deltaValues.deltaE}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2">-</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    {console.log("are you fetched 🙄🙄🙄", shot.fetched)}
                    {shot.fetched ? (
                      <button
                        className={`bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 ${
                          shot.ended ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => handleEndShot(index)}
                        disabled={shot.ended}
                      >
                        End Shot
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {(shots.length === 0 || shots[shots.length - 1].ended) && (
              <tr>
                <td colSpan="6" className="text-center py-4 bg-white/70">
                  <button
                    className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
                    onClick={handleAddShot}
                  >
                    Next Shot
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {tinterModalShotIndex !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <ShotTinterAddModal
              tinterModalShotIndex={tinterModalShotIndex}
              handleCloseTinterModal={handleCloseTinterModal}
              recipeTinters={recipeTinters}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShotsPage;
