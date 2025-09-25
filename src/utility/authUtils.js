// src/utils/authUtils.js
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    return null;
  }
};

export const hasFullAccess = () => {
  const storedUser = getStoredUser();
  return storedUser?.Role === "Admin" || storedUser?.Role === "Operator";
};
