import React, { useEffect, useState } from "react";
import userService from "../../../services/userService";
import userRoleService from "../../../services/userRoleService";
const UserMasters = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleMap, setRoleMap] = useState({}); // store id -> roleName
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
    Email: "",
    UserRoleId: "",
  });

  // get current user id (CreatedBy)
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser.UserId || 0;

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.Username ||
      !formData.Password ||
      !formData.Email ||
      !formData.UserRoleId
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await userService.postUser({ ...formData, CreatedBy: currentUserId });
      alert("User created successfully!");
      setFormData({ Username: "", Password: "", Email: "", UserRoleId: "" });
      fetchUsers(); // refresh table
    } catch (err) {
      console.error("Failed to create user:", err);
      alert("Error creating user");
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await userRoleService.getUserRoles(); // should return array [{UserRoleId, RoleName}]
      setRoles(data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);

      // Fetch role names for all unique role IDs
      const uniqueRoleIds = [
        ...new Set(data.map((u) => u.UserRoleId).filter(Boolean)),
      ];
      const roles = {};
      await Promise.all(
        uniqueRoleIds.map(async (id) => {
          try {
            const roleName = await userRoleService.getUserRolesById(id);
            roles[id] = roleName;
          } catch (err) {
            console.error(`Failed to fetch role for id ${id}:`, err);
            roles[id] = "Unknown";
          }
        })
      );
      setRoleMap(roles);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-green-900">User Master</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 text-green-900">
          Add New User
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {/* Username */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="Username"
              placeholder="Enter username"
              value={formData.Username}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="Password"
              placeholder="Enter password"
              value={formData.Password}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="Email"
              placeholder="Enter email"
              value={formData.Email}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Role Dropdown */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Role</label>
            <select
              name="UserRoleId"
              value={formData.UserRoleId}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.UserRoleId} value={role.UserRoleId}>
                  {role.RoleName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-semibold"
            >
              Add User
            </button>
          </div>
        </div>
      </form>

      <h3 className="text-lg font-semibold mb-3 text-green-900">
        Existing Users
      </h3>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No Users Found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="border px-3 py-2">Sr.No</th>
                <th className="border px-3 py-2">Username</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Role</th>
                <th className="border px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.UserId} className="hover:bg-gray-100">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{u.Username}</td>
                  <td className="border px-3 py-2">{u.Email}</td>
                  <td className="border px-3 py-2">
                    {roleMap[u.UserRoleId] || "Loading..."}
                  </td>
                  <td className="border px-3 py-2">
                    {u.IsActive ? (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        In-Active
                      </span>
                    )}
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

export default UserMasters;
