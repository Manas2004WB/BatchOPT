// services/tinterService.js
import axios from "axios";
import { authHeader } from "./authHeader"; // helper that attaches token if required

const API_BASE = "https://localhost:7130/api/Tinter"; // adjust if backend has different prefix

// ✅ Get all tinters
export const getTinters = async () => {
  const res = await axios.get(API_BASE, { headers: authHeader() });
  return res.data;
};

// ✅ Get tinter by ID with batches + measurements
export const getTinterById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`, { headers: authHeader() });
  return res.data;
};

// ✅ Create a simple tinter
export const createTinter = async (tinter) => {
  const res = await axios.post(API_BASE, tinter, { headers: authHeader() });
  return res.data;
};

// ✅ Update a tinter by ID
export const updateTinter = async (id, tinter) => {
  const res = await axios.put(`${API_BASE}/${id}`, tinter, {
    headers: authHeader(),
  });
  return res.data;
};

// ✅ Delete a tinter by ID
export const deleteTinter = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`, {
    headers: authHeader(),
  });
  return res.data;
};

// ✅ Create tinter with batches + measurements
export const createTinterWithBatches = async (tinterWithBatchesDto) => {
  const res = await axios.post(`${API_BASE}/full/`, tinterWithBatchesDto, {
    headers: authHeader(),
  });
  return res.data;
};

export default {
  getTinters,
  getTinterById,
  createTinter,
  updateTinter,
  deleteTinter,
  createTinterWithBatches,
};
