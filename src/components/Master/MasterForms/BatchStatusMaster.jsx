import React, { useEffect, useState } from "react";
import { formatUtcToLocal } from "../../../utility/utc2ist";
import batchStatusService from "../../../services/batchStatusService";
import { fetchUsernames } from "../../../utility/userNameHelper";

const BatchStatusMaster = () => {
  const [statuses, setStatuses] = useState([]);
  const [statusName, setStatusName] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernames, setUsernames] = useState({}); // store id -> username map

  useEffect(() => {
    fetchStatuses();
  }, []);

  // fetch all statuses
  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const data = await batchStatusService.getBatchStatus();
      setStatuses(data);

      // Use utility here
      const userMap = await fetchUsernames(data.map((s) => s.CreatedBy));
      setUsernames(userMap);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statusName.trim()) return alert("Status name is required!");

    try {
      await batchStatusService.postBatchStatus({
        StatusName: statusName,
      });
      setStatusName("");
      fetchStatuses(); // refresh list
    } catch (error) {
      console.error("Error creating status:", error);
      alert("Failed to create status.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-green-900">
        Create Batch Status
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm"
      >
        <input
          type="text"
          placeholder="Enter batch status"
          value={statusName}
          onChange={(e) => setStatusName(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Batch Status
        </button>
      </form>

      {/* Status Table */}
      <h3 className="text-lg font-semibold mb-3 text-green-900">
        Existing Statuses
      </h3>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : statuses.length === 0 ? (
        <p className="text-gray-600">No Status Found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="border px-3 py-2">Sr.No</th>
                <th className="border px-3 py-2">Status Name</th>
                <th className="border px-3 py-2">Created By</th>
                <th className="border px-3 py-2">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((status, idx) => (
                <tr
                  key={status.BatchStatusId}
                  className="hover:bg-green-50 transition"
                >
                  <td className="border px-3 py-2">{idx + 1}</td>
                  <td className="border px-3 py-2">{status.StatusName}</td>
                  <td className="border px-3 py-2">
                    {usernames[status.CreatedBy] || "Loading..."}
                  </td>
                  <td className="border px-3 py-2">
                    {status.UpdatedAt
                      ? formatUtcToLocal(status.UpdatedAt)
                      : "--"}
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
