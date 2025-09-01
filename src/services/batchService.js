// services/tinterService.js
import axios from "axios";
import { authHeader } from "./authHeader";

const API_BASE = "https://localhost:7130/api/Batch";

export const getBatches = async () => {
  const res = await axios.get(API_BASE, { headers: authHeader() });
  return res.data;
};
export const getBatchesByPlantId = async (plantId) => {
  const res = await axios.get(`${API_BASE}/${plantId}/ByPlantId`, {
    headers: authHeader(),
  });
  return res.data;
};
