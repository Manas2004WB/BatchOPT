// services/tinterService.js
import axios from "axios";
import { authHeader } from "./authHeader";

const API_BASE = "https://localhost:7130/api/TinterBatches";

export const getTinterBatches = async () => {
  const res = await axios.get(API_BASE, { headers: authHeader() });
  return res.data;
};
// ✅ Create a tinter batch with measurements
export const createTinterBatchWithMeasurements = async (batch) => {
  const res = await axios.post(`${API_BASE}/with-measurements`, batch, {
    headers: authHeader(),
  });
  return res.data;
};
// ✅ Get tinter batches with measurements
export const getTinterBatchesWithMeasurements = async (tinterId) => {
  const res = await axios.get(`${API_BASE}/${tinterId}/with-measurements`, {
    headers: authHeader(),
  });
  return res.data;
};

export default {
  getTinterBatchesWithMeasurements,
  getTinterBatches,
  createTinterBatchWithMeasurements,
};
