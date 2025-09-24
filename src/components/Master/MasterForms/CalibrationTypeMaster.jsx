import React, { useEffect, useState } from "react";
import calibrationTypeService from "../../../services/calibrationTypeService";

const BatchStatusMaster = () => {
  const [calibrationTypes, setCalibrationTypes] = useState([]);
  const [calibrationTypeName, setCalibrationTypeName] = useState("");
  const [loading, setLoading] = useState(false);

  let srNo = 1;

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
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-green-900">
        Create Calibration Type
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Enter calibration type"
          value={calibrationTypeName}
          onChange={(e) => setCalibrationTypeName(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Calibration Type
        </button>
      </form>

      {/* Existing Types Table */}
      <h3 className="text-lg font-semibold mb-3 text-green-900">
        Existing Types
      </h3>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : calibrationTypes.length === 0 ? (
        <p className="text-gray-600">No calibration types found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse text-center">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="border px-3 py-2">Sr.No</th>
                <th className="border px-3 py-2">Calibration Types</th>
              </tr>
            </thead>
            <tbody>
              {calibrationTypes.map((type, idx) => (
                <tr
                  key={type.CalibrationTypeId}
                  className="hover:bg-green-50 transition"
                >
                  <td className="border px-3 py-2">{idx + 1}</td>
                  <td className="border px-3 py-2">
                    {type.CalibrationTypeName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BatchStatusMaster;
