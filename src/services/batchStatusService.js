// services/userRoleService.js
import axios from "axios";
import { authHeader } from "./authHeader"; // helper that attaches token if required

const API_BASE = "https://localhost:7130/api/BatchStatus";

export const getBatchStatus = async () => {
  const res = await axios.get(`${API_BASE}/GetBatchStatus`, {
    headers: authHeader(),
  });
  return res.data;
};
export const postBatchStatus = async (data) => {
  const res = await axios.post(`${API_BASE}`, data, {
    headers: authHeader(),
  });
  return res.data;
};

export default {
  getBatchStatus,
  postBatchStatus,
};
