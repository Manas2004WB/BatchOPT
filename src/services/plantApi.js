import axios from "axios";
import { authHeader } from "./authHeader"; // helper that attaches token if required
const API_BASE = "https://localhost:7130/api/plant";

export const getPlants = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const getPlantById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`, { headers: authHeader() });
  return res.data;
};

export const createPlant = async (plant) => {
  console.log("Auth Header os", authHeader);

  const res = await axios.post(API_BASE, plant, { headers: authHeader() });
  return res.data;
};

export const updatePlant = async (id, plant) => {
  const res = await axios.put(`${API_BASE}/${id}`, plant, {
    headers: authHeader(),
  });
  return res.data;
};

export const deletePlant = async (id) => {
  await axios.delete(`${API_BASE}/${id}`, { headers: authHeader() });
};
