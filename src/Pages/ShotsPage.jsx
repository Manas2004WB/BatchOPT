import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import StandardRow from "../components/ShotComponents/StandardRow";
import ShotZeroRow from "../components/ShotComponents/ShotZeroRow";
import ShotRow from "../components/ShotComponents/ShotRow";
import TinterSelectionModal from "../components/ShotComponents/ShotTinterAddModal";
import { shot_measurements } from "../Data/shots/shot_measurements";
import { shots } from "../Data/shots/Shots";
import { shot_tinters } from "../Data/shots/shot_tinters";
import { skuVersionMeasurements } from "../Data/SkuMeasurementData";

const ShotPageTable = () => {
  const location = useLocation();
  const batch = location.state?.batch;
  const plantId = location.state?.plantId;
  const skuVersionId = batch?.sku_version_id;
  const batchId = batch?.batch_id;

  // Find zeroth shot for this batch
  const zerothShot = shots.find(
    (s) => s.batch_id === batchId && s.shot_number === 0
  );

  // Get measurements for zeroth shot
  const zerothShotMeasurements = shot_measurements.filter(
    (m) => m.shot_id === zerothShot?.shot_id
  );

  // Find all shots for this batch except shot 0
  const otherShots = shots.filter(
    (s) => s.batch_id === batchId && s.shot_number !== 0
  );

  // Helper to get measurements for a shot
  const getShotMeasurements = (shotId) =>
    shot_measurements.filter((m) => m.shot_id === shotId);

  // Helper to get tinter batch ids for a shot
  const getShotTinterBatchIds = (shotId) =>
    shot_tinters
      .filter((st) => st.shot_id === shotId)
      .map((st) => st.tinter_batch_id);

  // --- New shot state and modal logic ---
  const [showModal, setShowModal] = useState(false);
  const [modalShotIdx, setModalShotIdx] = useState(null);
  const [newShots, setNewShots] = useState([]);
  const [calInputs, setCalInputs] = useState({});
  const [pendingTinters, setPendingTinters] = useState([]);

  // Get next shot number
  const nextShotNumber =
    otherShots.length + newShots.length > 0
      ? Math.max(
          ...otherShots.map((s) => s.shot_number),
          ...newShots.map((s) => s.shotNumber)
        ) + 1
      : 1;

  // Get standard values for random generation
  const getStandard = (type) => {
    const val = skuVersionMeasurements.find(
      (m) => m.sku_version_id === skuVersionId && m.measurement_type === type
    )?.measurement_value;
    return val ?? "-";
  };

  // Generate random value within 10 of standard
  const randomNear = (standard) =>
    (standard + (Math.random() * 10 - 5)).toFixed(2);

  // Add new shot row (incomplete)
  const handleAddShot = () => {
    setNewShots((prev) => [
      ...prev,
      {
        shotNumber: nextShotNumber,
        skuVersionId,
        measurements: [],
        comments: "",
        tinterBatchIds: [],
        status: "incomplete",
        liquidFetched: false,
        colorFetched: false,
      },
    ]);
  };

  // Open tinter modal for a specific new shot row, pass preselected tinters
  const handleSelectTinter = (idx) => {
    setModalShotIdx(idx);
    setShowModal(true);
  };

  // Save selected tinters and batches to the new shot row
  const handleSaveTinters = (selectedTinters) => {
    setShowModal(false);
    setNewShots((prev) =>
      prev.map((shot, idx) =>
        idx === modalShotIdx
          ? {
              ...shot,
              tinterBatchIds: selectedTinters.map((t) => t.tinter_id),
              tinterBatchPairs: selectedTinters.map((t) => ({
                tinter_id: t.tinter_id,
                batch_id: t.batch_id,
              })),
            }
          : shot
      )
    );
    setModalShotIdx(null);
  };

  // Fetch only liquid values for a new shot row
  const handleFetchLiquid = (idx) => {
    setNewShots((prev) =>
      prev.map((shot, i) => {
        if (i !== idx) return shot;
        // Remove any previous liquid measurements
        const filtered = (shot.measurements || []).filter(
          (m) =>
            !["liquid_l", "liquid_a", "liquid_b"].includes(m.measurement_type)
        );
        return {
          ...shot,
          measurements: [
            ...filtered,
            {
              measurement_type: "liquid_l",
              measurement_value: Number(randomNear(getStandard("liquid_l"))),
            },
            {
              measurement_type: "liquid_a",
              measurement_value: Number(randomNear(getStandard("liquid_a"))),
            },
            {
              measurement_type: "liquid_b",
              measurement_value: Number(randomNear(getStandard("liquid_b"))),
            },
          ],
          liquidFetched: true,
        };
      })
    );
  };

  // Fetch only panel values for a new shot row
  const handleFetchPanel = (idx) => {
    setNewShots((prev) =>
      prev.map((shot, i) => {
        if (i !== idx) return shot;
        // Remove any previous panel measurements
        const filtered = (shot.measurements || []).filter(
          (m) => !["panel_l", "panel_a", "panel_b"].includes(m.measurement_type)
        );
        return {
          ...shot,
          measurements: [
            ...filtered,
            {
              measurement_type: "panel_l",
              measurement_value: Number(randomNear(getStandard("panel_l"))),
            },
            {
              measurement_type: "panel_a",
              measurement_value: Number(randomNear(getStandard("panel_a"))),
            },
            {
              measurement_type: "panel_b",
              measurement_value: Number(randomNear(getStandard("panel_b"))),
            },
          ],
          panelFetched: true,
        };
      })
    );
  };

  // Handle calorimeter input change
  const handleCalInputChange = (idx, field, value) => {
    setCalInputs((prev) => ({
      ...prev,
      [idx]: { ...prev[idx], [field]: value },
    }));
  };

  // Only add colorimeter L, a, b values (do not end shot)
  const handleFetchColor = (idx) => {
    const cal = calInputs[idx] || {};
    if (cal.l === undefined || cal.a === undefined || cal.b === undefined) {
      alert("Please enter all L, a, b values.");
      return;
    }
    setNewShots((prev) =>
      prev.map((shot, i) => {
        if (i !== idx) return shot;
        // Remove any previous colorimeter measurements
        const filtered = (shot.measurements || []).filter(
          (m) =>
            ![
              "delta_colorimeter_l",
              "delta_colorimeter_a",
              "delta_colorimeter_b",
            ].includes(m.measurement_type)
        );
        return {
          ...shot,
          measurements: [
            ...filtered,
            {
              measurement_type: "delta_colorimeter_l",
              measurement_value: Number(cal.l),
            },
            {
              measurement_type: "delta_colorimeter_a",
              measurement_value: Number(cal.a),
            },
            {
              measurement_type: "delta_colorimeter_b",
              measurement_value: Number(cal.b),
            },
          ],
          colorFetched: true,
        };
      })
    );
  };

  // End shot (mark as complete and add comments)
  const handleEndShot = (idx) => {
    setNewShots((prev) =>
      prev.map((shot, i) =>
        i === idx
          ? {
              ...shot,
              status: "complete",
              comments: "User added shot",
            }
          : shot
      )
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Shots Table for Batch #{batch?.batch_code || "Unknown"}
      </h2>
      <p className="text-sm text-gray-600 mb-2">Plant ID: {plantId || "N/A"}</p>

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Tinters</th>
            <th className="border p-2" colSpan={4}>
              Liquid Color
            </th>
            <th className="border p-2" colSpan={4}>
              Panel Color
            </th>
            <th className="border p-2" colSpan={4}>
              Colorimeter
            </th>
            <th className="border p-2">Comments</th>
            <th className="border p-2">Actions</th>
          </tr>
          <tr>
            <th />
            <th />
            <th className="border p-2">L</th>
            <th className="border p-2">A</th>
            <th className="border p-2">B</th>
            <th className="border p-2">ΔE</th>
            <th className="border p-2">L</th>
            <th className="border p-2">A</th>
            <th className="border p-2">B</th>
            <th className="border p-2">ΔE</th>
            <th className="border p-2">L</th>
            <th className="border p-2">A</th>
            <th className="border p-2">B</th>
            <th className="border p-2">ΔE</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          <StandardRow skuVersionId={skuVersionId} />
          <ShotZeroRow
            skuVersionId={skuVersionId}
            measurements={zerothShotMeasurements}
            comments={zerothShot?.comments || ""}
          />
          {otherShots.map((shot) => (
            <ShotRow
              key={shot.shot_id}
              shotNumber={shot.shot_number}
              skuVersionId={skuVersionId}
              measurements={getShotMeasurements(shot.shot_id)}
              comments={shot.comments}
              tinterBatchIds={getShotTinterBatchIds(shot.shot_id)}
              actionCell={<span className="text-green-600">Shot Ended</span>}
            />
          ))}
          {newShots.map((shot, idx) => (
            <ShotRow
              key={`new-${idx}`}
              shotNumber={shot.shotNumber}
              skuVersionId={skuVersionId}
              measurements={shot.measurements}
              comments={shot.comments}
              tinterBatchIds={shot.tinterBatchIds}
              isNew={true}
              calInputs={calInputs[idx] || {}}
              onCalInputChange={(field, value) =>
                handleCalInputChange(idx, field, value)
              }
              onCalculateDeltaE={() => handleFetchColor(idx)}
              colorInputsDisabled={!shot.liquidFetched || shot.colorFetched}
              showSelectTinterButton={
                shot.status === "complete" ? null : (
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs mb-1"
                    onClick={() => handleSelectTinter(idx)}
                  >
                    {shot.tinterBatchIds && shot.tinterBatchIds.length > 0
                      ? "Edit Tinters"
                      : "Select Tinter"}
                  </button>
                )
              }
              actionCell={
                shot.status === "complete" ? (
                  <span className="text-green-600">Shot Ended</span>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleFetchLiquid(idx)}
                      disabled={shot.liquidFetched}
                    >
                      Fetch Liquid
                    </button>
                    <button
                      className="bg-orange-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleFetchPanel(idx)}
                      disabled={shot.panelFetched}
                    >
                      Fetch Panel
                    </button>
                    <button
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleEndShot(idx)}
                      disabled={shot.status === "complete"}
                    >
                      End Shot
                    </button>
                  </div>
                )
              }
            />
          ))}
        </tbody>
      </table>
      {batch.status !== "completed" && (
        <div className="mt-4 text-right">
          <button
            onClick={handleAddShot}
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
          >
            Add Shot
          </button>
        </div>
      )}
      <TinterSelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTinters}
        plantId={plantId}
        allowedTinterIds={[]} // Set allowed tinter IDs as needed
        preselectedTinters={
          modalShotIdx !== null && newShots[modalShotIdx]?.tinterBatchPairs
            ? newShots[modalShotIdx].tinterBatchPairs
            : []
        }
      />
    </div>
  );
};

export default ShotPageTable;
