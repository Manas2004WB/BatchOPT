import React, { useEffect, useState } from "react";
import userRoleService from "../../../services/userRoleService";
import { formatUtcToLocal } from "../../../utility/utc2ist";
import { fetchUsernames } from "../../../utility/userNameHelper";

const UserRolesMaster = () => {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [usernames, setUsernames] = useState({});
  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);
  let srNo = 1;
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await userRoleService.getUserRoles();
      setRoles(data);
      const userMap = await fetchUsernames(data.map((s) => s.CreatedBy));
      setUsernames(userMap);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) return alert("Role name is required!");

    try {
      await userRoleService.postUserRoles({
        RoleName: roleName,
        IsActive: isActive,
      });
      setRoleName("");
      setIsActive(true);
      fetchRoles(); // refresh list
    } catch (error) {
      console.error("Error creating role:", error);
      alert("Failed to create role.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-green-900">
        Create User Roles
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm"
      >
        <input
          type="text"
          placeholder="Enter role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-green-600"
          />
          Active
        </label>

        <button
          type="submit"
          className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Role
        </button>
      </form>

      {/* Roles Table */}
      <h3 className="text-lg font-semibold mb-3 text-green-900">
        Existing Roles
      </h3>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : roles.length === 0 ? (
        <p className="text-gray-600">No roles found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="border px-3 py-2">Sr.No</th>
                <th className="border px-3 py-2">Role Name</th>
                <th className="border px-3 py-2">Active</th>
                <th className="border px-3 py-2">Created By</th>
                <th className="border px-3 py-2">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, idx) => (
                <tr
                  key={role.userRoleId}
                  className="hover:bg-green-50 transition"
                >
                  <td className="border px-3 py-2">{idx + 1}</td>
                  <td className="border px-3 py-2">{role.RoleName}</td>
                  <td className="border px-3 py-2">
                    {role.IsActive ? (
                      <span className="text-green-700 font-medium">Active</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactive</span>
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {usernames[role.CreatedBy] || "Loading..."}
                  </td>
                  <td className="border px-3 py-2">
                    {role.UpdatedAt ? formatUtcToLocal(role.UpdatedAt) : "--"}
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

export default UserRolesMaster;
