// src/utils/authHeader.js
export function authHeader() {
  const token = localStorage.getItem("token"); // only store the JWT now
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}
