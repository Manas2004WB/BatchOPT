// services/userService.js
import axios from "axios";
import { authHeader } from "./authHeader";

const API_BASE = "https://localhost:7130/api/User";

export const getUserNameById = async (userId) => {
  const res = await axios.get(`${API_BASE}/${userId}/GetUernameByID`, {
    headers: authHeader(),
  });
  return res.data;
};
// post user
export const postUser = async (userData) => {
  const res = await axios.post(API_BASE, userData, {
    headers: authHeader(),
  });
  return res.data;
};

// ✅ Get all users
export const getAllUsers = async () => {
  const res = await axios.get(API_BASE, {
    headers: authHeader(),
  });
  return res.data; // this will be an array of users
};

export default {
  getUserNameById,
  postUser,
  getAllUsers,
};
