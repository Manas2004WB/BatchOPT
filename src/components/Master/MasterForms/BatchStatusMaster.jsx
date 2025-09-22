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
      <h2 className="text-xl font-bold mb-4">Create Batch Status</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Enter batch status"
          value={statusName}
          onChange={(e) => setStatusName(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add BatchStatus
        </button>
      </form>

      {/* Status Table */}
      <h3 className="text-lg font-semibold mb-2">Existing Statuses</h3>
      {loading ? (
        <p>Loading...</p>
      ) : statuses.length === 0 ? (
        <p>No Status Found.</p>
      ) : (
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="bg-[#3dcd58] text-white">
              <th className="border p-2">ID</th>
              <th className="border p-2">Status Name</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((status) => (
              <tr key={status.BatchStatusId}>
                <td className="border p-2">{status.BatchStatusId}</td>
                <td className="border p-2">{status.StatusName}</td>
                <td className="border p-2">
                  {usernames[status.CreatedBy] || "Loading..."}
                </td>
                <td className="border p-2">
                  {status.UpdatedAt ? formatUtcToLocal(status.UpdatedAt) : "--"}
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
