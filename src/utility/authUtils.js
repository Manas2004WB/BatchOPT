// src/utils/authUtils.js
import jwtDecode from "jwt-decode";

/**
 * Get the JWT token from localStorage
 */
export const getStoredToken = () => {
  return localStorage.getItem("token") || null;
};

/**
 * Decode the token and return user info
 */
export const getStoredUser = () => {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      id: decoded.user_id,
      username: decoded.sub, // now will be PlantAdmin
      email: decoded.email, // new claim
      role: decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ],
      exp: decoded.exp,
    };
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};

/**
 * Check if user has full access
 * Admin and Operator have full access
 */
export const hasFullAccess = () => {
  const user = getStoredUser();
  if (!user) return false;

  const role = user.role;
  return role === "Admin" || role === "Operator";
};
