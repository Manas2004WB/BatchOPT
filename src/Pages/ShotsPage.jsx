import React, { useState } from "react";
import ShotTinterAddModal from "../components/ShotComponents/ShotTinterAddModal";
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
import StandardRow from "../components/ShotComponents/StandardRow";
import ShotRow from "../components/ShotComponents/ShotRow";
import { calcDeltaE, getMeasurement } from "../utility/shotUtils";

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

  const liquidL = getMeasurement(measurements, "liquid_l");
  const liquidA = getMeasurement(measurements, "liquid_a");
  const liquidB = getMeasurement(measurements, "liquid_b");
  const targetDeltaE = getMeasurement(measurements, "target_delta_e");
  const panelL = getMeasurement(measurements, "panel_l");
  const panelA = getMeasurement(measurements, "panel_a");
  const panelB = getMeasurement(measurements, "panel_b");
  const colorimeterL = getMeasurement(measurements, "colorimeter_l");
  const colorimeterA = getMeasurement(measurements, "colorimeter_a");
  const colorimeterB = getMeasurement(measurements, "colorimeter_b");

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

  // Fetch only the selected type (liquid, panel, colorimeter) for a shot
  const handleFetch = (shotId, type) => {
    setShots((prevShots) =>
      prevShots.map((shot) => {
        if (shot.id !== shotId) return shot;

        // Generate random values for demonstration (liquid/panel)
        const randomL = Number((Math.random() * 10 + 50).toFixed(2));
        const randomA = Number((Math.random() * 5 + 10).toFixed(2));
        const randomB = Number((Math.random() * 8 + 20).toFixed(2));

        let newValues = { ...shot.values };
        if (type === "liquid") {
          newValues.l_liquid = randomL;
          newValues.a_liquid = randomA;
          newValues.b_liquid = randomB;
          newValues.deltaE_liquid = calcDeltaE(
            randomL,
            randomA,
            randomB,
            liquidL,
            liquidA,
            liquidB
          );
        }
        if (type === "panel") {
          newValues.l_panel = randomL;
          newValues.a_panel = randomA;
          newValues.b_panel = randomB;
          newValues.deltaE_panel = calcDeltaE(
            randomL,
            randomA,
            randomB,
            panelL,
            panelA,
            panelB
          );
        }
        if (type === "colorimeter") {
          // Use current input values for colorimeter
          const l = shot.values.l_colorimeter ?? 0;
          const a = shot.values.a_colorimeter ?? 0;
          const b = shot.values.b_colorimeter ?? 0;
          newValues.deltaE_colorimeter = calcDeltaE(
            l,
            a,
            b,
            colorimeterL,
            colorimeterA,
            colorimeterB
          );
        }
        return {
          ...shot,
          values: newValues,
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

  const handleColorimeterChange = (shotId, key, value) => {
    setShots((prevShots) =>
      prevShots.map((shot) =>
        shot.id === shotId
          ? {
              ...shot,
              values: {
                ...shot.values,
                [key]: parseFloat(value) || 0,
              },
            }
          : shot
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
      <div className="max-h-[70vh] p-2 overflow-y-auto rounded-lg">
        <table className="min-w-full text-centre border-none backdrop-blur">
          <thead className="bg-cyan-700 text-white sticky top-0 z-10">
            <tr className="">
              <th className=" px-2 py-1">#</th>
              <th className=" px-2 py-1">Tinters</th>
              <th className=" px-2 py-1" colSpan={4}>
                Liquid Color
              </th>
              <th className=" px-2 py-1" colSpan={4}>
                Panel Color
              </th>
              <th className=" px-2 py-1" colSpan={4}>
                Colorimeter
              </th>
              <th className=" px-2 py-1">Comment</th>
              <th className=" px-2 py-1">Actions</th>
            </tr>
            <tr className=" ">
              <th className="border px-2 py-1"></th>
              <th className="border px-2 py-1"></th>
              <th className="border px-2 py-1">L</th>
              <th className="border px-2 py-1">A</th>
              <th className="border px-2 py-1">B</th>
              <th className="border px-2 py-1">ΔE</th>
              <th className="border px-2 py-1">L</th>
              <th className="border px-2 py-1">A</th>
              <th className="border px-2 py-1">B</th>
              <th className="border px-2 py-1">ΔE</th>
              <th className="border px-2 py-1">L</th>
              <th className="border px-2 py-1">A</th>
              <th className="border px-2 py-1">B</th>
              <th className="border px-2 py-1">ΔE</th>
              <th className="border px-2 py-1"></th>
              <th className="border px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {/* Standard Row */}
            <StandardRow
              recipeTinters={recipeTinters}
              liquidL={liquidL}
              liquidA={liquidA}
              liquidB={liquidB}
              targetDeltaE={targetDeltaE}
              panelL={panelL}
              panelA={panelA}
              panelB={panelB}
              colorimeterL={colorimeterL}
              colorimeterA={colorimeterA}
              colorimeterB={colorimeterB}
            />
            {shots.length > 0 && (
              <tr className="border-b border-white/30 bg-cyan-700 text-white text-center">
                <td className="border px-2 py-1"></td>
                <td className="border px-2 py-1"></td>
                <td className="border px-2 py-1">ΔL</td>
                <td className="border px-2 py-1">ΔA</td>
                <td className="border px-2 py-1">ΔB</td>
                <td className="border px-2 py-1">ΔE</td>
                <td className="border px-2 py-1">ΔL</td>
                <td className="border px-2 py-1">ΔA</td>
                <td className="border px-2 py-1">ΔB</td>
                <td className="border px-2 py-1">ΔE</td>
                <td className="border px-2 py-1">ΔL</td>
                <td className="border px-2 py-1">ΔA</td>
                <td className="border px-2 py-1">ΔB</td>
                <td className="border px-2 py-1">ΔE</td>
                <td className="border px-2 py-1"></td>
                <td className="border px-2 py-1"></td>
              </tr>
            )}
            {/* Shot Rows */}
            {shots.map((shot) => (
              <ShotRow
                key={shot.id}
                shot={shot}
                handleOpenTinterModal={handleOpenTinterModal}
                handleColorimeterChange={handleColorimeterChange}
                handleCommentChange={handleCommentChange}
                handleFetch={handleFetch}
                handleEndShot={handleEndShot}
              />
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
