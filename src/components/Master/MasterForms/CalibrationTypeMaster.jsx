import React, { useEffect, useState } from "react";
import calibrationTypeService from "../../../services/calibrationTypeService";

const BatchStatusMaster = () => {
  const [calibrationTypes, setCalibrationTypes] = useState([]);
  const [calibrationTypeName, setCalibrationTypeName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const data = await calibrationTypeService.getCalibrationTypes();
      setCalibrationTypes(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!calibrationTypeName.trim())
      return alert("Calibration type is required!");

    try {
      await calibrationTypeService.postCalibrationType({
        CalibrationTypeName: calibrationTypeName,
      });
      setCalibrationTypeName("");
      fetchTypes(); // refresh list
    } catch (error) {
      console.error("Error creating status:", error);
      alert("Failed to create type");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Batch Status</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Enter calibration type"
          value={calibrationTypeName}
          onChange={(e) => setCalibrationTypeName(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Calibration Type
        </button>
      </form>

      {/* Roles Table */}
      <h3 className="text-lg font-semibold mb-2">Existing Types</h3>
      {loading ? (
        <p>Loading...</p>
      ) : calibrationTypes.length === 0 ? (
        <p>No Status FOund.</p>
      ) : (
        <table className="w-full border-collapse border text-centre">
          <thead>
            <tr className="bg-[#3dcd58] text-white">
              <th className="border p-2">ID</th>
              <th className="border p-2">Calibration Types</th>
            </tr>
          </thead>
          <tbody>
            {calibrationTypes.map((status) => (
              <tr key={status.CalibrationTypeId}>
                <td className="border p-2 text-center">
                  {status.CalibrationTypeId}
                </td>
                <td className="border p-2 text-center">
                  {status.CalibrationTypeName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BatchStatusMaster;
