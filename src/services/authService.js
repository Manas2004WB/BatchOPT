import api from "./api";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/Auth/login", {
      email,
      password,
    });
    return response.data; // contains { token, userId, username, role, email }
  } catch (error) {
    throw (
      error.response?.data || "Login failed. Please check your credentials."
    );
  }
};
