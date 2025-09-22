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
      <h2 className="text-xl font-bold mb-4">Create User Roles</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Enter role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="border p-2 rounded w-1/2"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Role
        </button>
      </form>

      {/* Roles Table */}
      <h3 className="text-lg font-semibold mb-2">Existing Roles</h3>
      {loading ? (
        <p>Loading...</p>
      ) : roles.length === 0 ? (
        <p>No roles found.</p>
      ) : (
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="bg-[#3dcd58] text-white">
              <th className="border p-2">ID</th>
              <th className="border p-2">Role Name</th>
              <th className="border p-2">Active</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.userRoleId}>
                <td className="border p-2">{role.UserRoleId}</td>
                <td className="border p-2">{role.RoleName}</td>
                <td className="border p-2">{role.IsActive ? "Yes" : "No"}</td>
                <td className="border p-2">{usernames[role.CreatedBy]}</td>
                <td className="border p-2">
                  {formatUtcToLocal(role.UpdatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserRolesMaster;
