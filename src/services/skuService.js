import axios from "axios";
import { authHeader } from "./authHeader"; // assuming you already have this

const API_BASE = "https://localhost:7130/api/skuVersions"; // update base URL as per your API

// Get all SKUs for a plant with versions + measurements
export const getSkusWithVersionMeasurements = async (plantId) => {
  const res = await axios.get(`${API_BASE}/${plantId}/with-latest-version`, {
    headers: authHeader(),
  });
  return res.data;
};

export const GetOlderVersionsMeasurements = async (skuId) => {
  try {
    const res = await axios.get(`${API_BASE}/${skuId}/older-versions`, {
      headers: authHeader(),
    });
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch older versions:", error);
    throw error;
  }
};

const API_BASE_POST = "https://localhost:7130/api/Sku/with-measurements"; // update base URL as per your API
export const postSkuWithVersionMeasurements = async (skuData) => {
  const res = await axios.post(API_BASE_POST, skuData, {
    headers: authHeader(),
  });
  return res.data;
};

export const GetTargetDeltaEBySkuVersion = async (skuVersionId) => {
  const res = await axios.get(
    `https://localhost:7130/api/Sku/GetTargetDeltaEBySkuVersion/${skuVersionId}`,
    { headers: authHeader() }
  );
  return res.data;
};
