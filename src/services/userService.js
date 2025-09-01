// services/userService.js
import axios from "axios";
import { authHeader } from "./authHeader";

const API_BASE = "https://localhost:7130/api/User";

export const getUserNameById = async (userId) => {
  const res = await axios.get(`${API_BASE}/${userId}/GetUernameByID`, {
    headers: authHeader(),
  });
  return res.data; // returns string username
};
