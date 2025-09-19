// services/userRoleService.js
import axios from "axios";
import { authHeader } from "./authHeader"; // helper that attaches token if required

const API_BASE = "https://localhost:7130/api/UserRoles";

export const getUserRoles = async () => {
  const res = await axios.get(`${API_BASE}/GetUserRoles`, {
    headers: authHeader(),
  });
  return res.data;
};
export const postUserRoles = async (data) => {
  const res = await axios.post(`${API_BASE}`, data, {
    headers: authHeader(),
  });
  return res.data;
};

export default {
  getUserRoles,
  postUserRoles,
};
