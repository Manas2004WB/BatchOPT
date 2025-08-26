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
  const [showCloseModal, setShowCloseModal] = useState(false);
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

  // Generate random values for demonstration (liquid/panel)
  const randomLLiquid = Number(
    (Number(liquidL) + Math.random() * 10).toFixed(2)
  );
  const randomALiquid = Number(
    (Number(liquidA) + Math.random() * 10).toFixed(2)
  );
  const randomBLiquid = Number(
    (Number(liquidB) + Math.random() * 10).toFixed(2)
  );
  const randomLPanel = Number((Number(panelL) + Math.random() * 10).toFixed(2));
  const randomAPanel = Number((Number(panelA) + Math.random() * 10).toFixed(2));
  const randomBPanel = Number((Number(panelB) + Math.random() * 10).toFixed(2));
  const COMPLETED_STATUS_ID_Complete = 2;
  const COMPLETED_STATUS_ID_Abandon = 3;

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

        let newValues = { ...shot.values };
        if (type === "liquid") {
          newValues.l_liquid = (randomLLiquid - liquidL).toFixed(2);
          newValues.a_liquid = (randomALiquid - liquidA).toFixed(2);
          newValues.b_liquid = (randomBLiquid - liquidB).toFixed(2);
          newValues.deltaE_liquid = calcDeltaE(
            randomLLiquid,
            randomALiquid,
            randomBLiquid,
            liquidL,
            liquidA,
            liquidB
          );
        }
        if (type === "panel") {
          newValues.l_panel = (randomLPanel - panelL).toFixed(2);
          newValues.a_panel = (randomAPanel - panelA).toFixed(2);
          newValues.b_panel = (randomBPanel - panelB).toFixed(2);
          newValues.deltaE_panel = calcDeltaE(
            randomLPanel,
            randomAPanel,
            randomBPanel,
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
              tinters: selectedTinters, // Store as array of { tinter_id, batch_id }
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

  const handleCloseShot = (batchId, status) => {
    const batch = batches.find((b) => b.batch_id === Number(batchId));
    if (!batch) {
      console.error(`Batch ${batchId} not found`);
      return;
    }

    if (status === "Abondon") {
      batch.batch_status_id = COMPLETED_STATUS_ID_Abandon;
      batch.updated_at = new Date().toISOString();
      batch.updated_by = 1;
      console.log(`Batch ${batchId} marked as Abandoned`, batch);
    } else if (status === "Complete") {
      batch.batch_status_id = COMPLETED_STATUS_ID_Complete;
      batch.updated_at = new Date().toISOString();
      batch.updated_by = 1;
      console.log(`Batch ${batchId} marked as Completed`, batch);
    } else {
      console.warn(`Unknown status: ${status}`);
    }
  };

  const isCompleted = batch?.batch_status_id === 2;
  return (
    <div
      className="w-full min-h-screen overflow-hidden bg-cover bg-center "
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <NavbarShots batch={batch} />
      <h2 className="text-xl font-bold mx-6 my-2 text-white">Shots Table</h2>
      <div className="max-h-[70vh] p-2 overflow-y-auto rounded-lg">
        <table className="min-w-full text-centre border-none backdrop-blur">
          <thead className="bg-cyan-700 text-white">
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
              <tr className="border-b border-white/30 bg-cyan-700 text-white sticky top-0 z-10 text-center">
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
                key={shot.shot_id ?? shot.id}
                shot={shot}
                handleOpenTinterModal={handleOpenTinterModal}
                handleColorimeterChange={handleColorimeterChange}
                handleCommentChange={handleCommentChange}
                handleFetch={handleFetch}
                handleEndShot={handleEndShot}
                colorimeterL={colorimeterL}
                colorimeterA={colorimeterA}
                colorimeterB={colorimeterB}
                randomLLiquid={randomLLiquid}
                randomALiquid={randomALiquid}
                randomBLiquid={randomBLiquid}
                randomLPanel={randomLPanel}
                randomAPanel={randomAPanel}
                randomBPanel={randomBPanel}
                isCompleted={isCompleted}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Next Shot - only if not completed */}
      {!isCompleted && (shots.length === 0 || shots[shots.length - 1].ended) ? (
        <button
          className="mx-6 my-2 bg-cyan-600 text-white px-4 py-2 rounded"
          onClick={handleAddShot}
        >
          Add Shot
        </button>
      ) : null}

      {/* Close Batch - only if not completed */}
      {!isCompleted && (shots.length === 0 || shots[shots.length - 1].ended) ? (
        <button
          className="mx-6 my-2 bg-cyan-600 text-white px-4 py-2 rounded"
          onClick={() => setShowCloseModal(true)}
        >
          Close Batch
        </button>
      ) : null}
      {showCloseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Close Batch</h3>
            <p>Are you sure you want to complete / abandon this batch?</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded mr-2"
                onClick={() => setShowCloseModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-cyan-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  handleCloseShot(batchId, "Abondon");
                  setShowCloseModal(false);
                }}
              >
                Abandon
              </button>
              <button
                className="bg-cyan-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  handleCloseShot(batchId, "Complete");
                  setShowCloseModal(false);
                }}
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}

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
