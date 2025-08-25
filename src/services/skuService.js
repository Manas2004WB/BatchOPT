import axios from "axios";
import { authHeader } from "./authHeader"; // assuming you already have this

const API_BASE = "https://localhost:7130/api/skuVersions"; // update base URL as per your API

// Get all SKUs for a plant with versions + measurements
export const getSkusWithVersionMeasurements = async (plantId) => {
  const res = await axios.get(`${API_BASE}/${plantId}/with-versions`, {
    headers: authHeader(),
  });
  return res.data;
};
