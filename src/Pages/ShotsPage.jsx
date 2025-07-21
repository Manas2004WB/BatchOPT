import React, { useState } from "react";
import ShotTinterAddModal from "../components/ShotTinterAddModal";
import { skuVersions } from "../Data/SkuVersionData";
import { skuData } from "../Data/SkuData";
import { skuVersionMeasurements } from "../Data/SkuMeasurementData";
import { standardRecipes } from "../Data/standardRecipes";
import { tinters } from "../Data/TinterData";
import { batches } from "../Data/Batches";
import { useLocation, useParams } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import NavbarShots from "../components/NavbarShots";
import { tinterBatches } from "../Data/TinterBatches";

const ShotsPage = ({ user }) => {
  const location = useLocation();
  const { plantId } = location.state || {};
  const { batchId } = useParams();
  const batch = batches.find((b) => b.batch_id === parseInt(batchId));
  const [shots, setShots] = useState([]);
  const [showTinterModal, setShowTinterModal] = useState(false);
  const [currentShotId, setCurrentShotId] = useState(null);

  // Helper functions to extract Standard row data

  const measurements = skuVersionMeasurements.filter(
    (m) => m.sku_version_id === batch?.sku_version_id
  );

  const getMeasurement = (type) =>
    Number(
      measurements.find((m) => m.measurement_type === type)?.measurement_value
    ) || "-";

  const liquidL = getMeasurement("liquid_l");
  const liquidA = getMeasurement("liquid_a");
  const liquidB = getMeasurement("liquid_b");
  const targetDeltaE = getMeasurement("target_delta_e");
  const panelL = getMeasurement("panel_l");
  const panelA = getMeasurement("panel_a");
  const panelB = getMeasurement("panel_b");
  const colorimeterL = getMeasurement("colorimeter_l");
  const colorimeterA = getMeasurement("colorimeter_a");
  const colorimeterB = getMeasurement("colorimeter_b");

  const recipeTinters = standardRecipes
    .filter((r) => r.sku_version_id === batch?.sku_version_id)
    .map((r) => {
      const tinter = tinters.find((t) => t.tinter_id === r.tinter_id);
      return tinter?.tinter_code || `Tinter-${r.tinter_id}`;
    });

  const handleAddShot = () => {
    const shotNumber = shots.length;
    const isFirstShot = shotNumber === 0;

    const newShot = {
      id: shotNumber,
      tinters: isFirstShot ? [] : null,
      values: { l: "-", a: "-", b: "-", deltaE: "-" },
      comment: "",
      ended: false,
    };

    setShots([...shots, newShot]);
  };

  const handleFetch = (shotId) => {
    setShots((prevShots) =>
      prevShots.map((shot) => {
        if (shot.id !== shotId) return shot;

        // Generate random values for demonstration
        const randomL = Number((Math.random() * 10 + 50).toFixed(2));
        const randomA = Number((Math.random() * 5 + 10).toFixed(2));
        const randomB = Number((Math.random() * 8 + 20).toFixed(2));

        // Calculate delta for each reference
        const calcDeltaE = (refL, refA, refB) => {
          const deltaL = randomL - refL;
          const deltaA = randomA - refA;
          const deltaB = randomB - refB;
          return Math.sqrt(
            deltaL * deltaL + deltaA * deltaA + deltaB * deltaB
          ).toFixed(2);
        };

        // For shot 0 and onwards, always calculate Euclidean distance for all three
        return {
          ...shot,
          values: {
            l: randomL,
            a: randomA,
            b: randomB,
            deltaE_liquid: calcDeltaE(liquidL, liquidA, liquidB),
            deltaE_panel: calcDeltaE(panelL, panelA, panelB),
            deltaE_colorimeter: calcDeltaE(
              colorimeterL,
              colorimeterA,
              colorimeterB
            ),
          },
        };
      })
    );
  };

  const handleEndShot = (shotId) => {
    setShots((prevShots) =>
      prevShots.map((shot) =>
        shot.id === shotId ? { ...shot, ended: true } : shot
      )
    );
  };

  const handleOpenTinterModal = (shotId) => {
    setCurrentShotId(shotId);
    setShowTinterModal(true);
  };

  const handleSaveTinters = (selectedTinters) => {
    setShots((prevShots) =>
      prevShots.map((shot) =>
        shot.id === currentShotId
          ? {
              ...shot,
              tinters: selectedTinters.map((t) => {
                const tinterObj = tinters.find(
                  (x) => x.tinter_id === t.tinter_id
                );
                const batchObj = tinterBatches.find(
                  (b) => b.tinter_batch_id === t.batch_id
                );

                const tinterCode =
                  tinterObj?.tinter_code || `Tinter-${t.tinter_id}`;
                const batchCode =
                  batchObj?.batch_tinter_name || `Batch-${t.batch_id}`;

                return `${tinterCode} - ${batchCode}`;
              }),
            }
          : shot
      )
    );
    setShowTinterModal(false);
    setCurrentShotId(null);
  };

  const handleCommentChange = (shotId, comment) => {
    setShots((prevShots) =>
      prevShots.map((shot) =>
        shot.id === shotId ? { ...shot, comment } : shot
      )
    );
  };

  return (
    <div
      className="w-full min-h-screen overflow-hidden bg-cover bg-center "
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <NavbarShots batch={batch} />
      <h2 className="text-xl font-bold mx-6 my-2 text-white">Shots Table</h2>
      <div className="p-6 text-white text-xl">
        <table className="min-w-full text-centre border border-white/30 backdrop-blur ">
          <thead className="bg-cyan-700 text-white sticky top-0 z-10">
            <tr className="border-b border-white/30">
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Tinters</th>
              <th className="border px-2 py-1" colSpan={4}>
                Liquid Color
              </th>
              <th className="border px-2 py-1" colSpan={4}>
                Panel Color
              </th>
              <th className="border px-2 py-1" colSpan={4}>
                Colorimeter
              </th>
              <th className="border px-2 py-1">Comment</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
            <tr className="border-b border-white/30">
              <th className="border px-2 py-1"></th>
              <th className="border px-2 py-1"></th>
              <th className="border px-2 py-1">ΔL</th>
              <th className="border px-2 py-1">ΔA</th>
              <th className="border px-2 py-1">ΔB</th>
              <th className="border px-2 py-1">ΔE</th>
              <th className="border px-2 py-1">ΔL</th>
              <th className="border px-2 py-1">ΔA</th>
              <th className="border px-2 py-1">ΔB</th>
              <th className="border px-2 py-1">ΔE</th>
              <th className="border px-2 py-1">ΔL</th>
              <th className="border px-2 py-1">ΔA</th>
              <th className="border px-2 py-1">ΔB</th>
              <th className="border px-2 py-1">ΔE</th>
              <th className="border px-2 py-1"></th>
              <th className="border px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {/* Standard Row */}
            <tr className="border-t border-white/30 hover:bg-white/80 transition bg-white/70 text-black">
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
            {/* Shot Rows */}
            {shots.map((shot) => (
              <tr
                key={shot.id}
                className="border-t border-white/30 hover:bg-white/80 transition bg-white/70 text-black"
              >
                {console.log("💀💀💀", shot)}
                <td className="border px-2 py-1 font-semibold">
                  Shot {shot.id}
                </td>
                <td className="border px-2 py-1 align-top">
                  {shot.id > 0 ? (
                    <div>
                      <button
                        className="bg-cyan-600 text-white px-2 py-1 rounded mr-2 mb-1"
                        onClick={() => handleOpenTinterModal(shot.id)}
                        disabled={shot.ended}
                      >
                        {shot.tinters ? "Re-select Tinters" : "Select Tinters"}
                      </button>
                      {shot.tinters && (
                        <div className="text-xs text-gray-700">
                          {shot.tinters.join(", ")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                {/* Liquid Color */}

                <td className="border px-2 py-1">{shot.values.l}</td>
                <td className="border px-2 py-1">{shot.values.a}</td>
                <td className="border px-2 py-1">{shot.values.b}</td>
                <td className="border px-2 py-1">
                  {shot.values.deltaE_liquid}
                </td>
                {/* Panel Color */}
                <td className="border px-2 py-1">{shot.values.l}</td>
                <td className="border px-2 py-1">{shot.values.a}</td>
                <td className="border px-2 py-1">{shot.values.b}</td>
                <td className="border px-2 py-1">{shot.values.deltaE_panel}</td>
                {/* Colorimeter */}
                <td className="border px-2 py-1">{shot.values.l}</td>
                <td className="border px-2 py-1">{shot.values.a}</td>
                <td className="border px-2 py-1">{shot.values.b}</td>
                <td className="border px-2 py-1">
                  {shot.values.deltaE_colorimeter}
                </td>
                <td className="border px-2 py-1 w-48">
                  <textarea
                    className="w-full border p-1 text-xs"
                    placeholder="Add comment..."
                    value={shot.comment}
                    disabled={shot.ended}
                    onChange={(e) =>
                      handleCommentChange(shot.id, e.target.value)
                    }
                  ></textarea>
                </td>
                <td className="border px-2 py-1 align-top">
                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleFetch(shot.id)}
                      disabled={shot.ended}
                    >
                      Fetch LAB Values
                    </button>
                    {!shot.ended && (
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleEndShot(shot.id)}
                      >
                        End Shot
                      </button>
                    )}
                    {shot.ended && (
                      <span className="text-green-600 font-semibold text-xs">
                        Shot Ended
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Next Shot */}
      {shots.length === 0 || shots[shots.length - 1].ended ? (
        <button
          className="mx-6 my-2 bg-cyan-600 text-white px-4 py-2 rounded"
          onClick={handleAddShot}
        >
          Add Next Shot
        </button>
      ) : null}

      {/* Tinter Selection Modal */}
      <ShotTinterAddModal
        plantId={plantId}
        isOpen={showTinterModal}
        onClose={() => setShowTinterModal(false)}
        onSave={handleSaveTinters}
        preselectedTinters={
          currentShotId !== null && shots[currentShotId]?.tinters
            ? shots[currentShotId].tinters
            : []
        }
        allowedTinterIds={standardRecipes
          .filter((r) => r.sku_version_id === batch?.sku_version_id)
          .map((r) => r.tinter_id)}
      />
    </div>
  );
};

export default ShotsPage;
