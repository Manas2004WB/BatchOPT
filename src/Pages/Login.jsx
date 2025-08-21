import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import heroBg from "../assets/hero-bg.jpg";

const Login = ({ setUser }) => {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(login.email, login.password);

      // ✅ Save user + token in localStorage
      localStorage.setItem("token", data.Token);
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data); // if App uses context/state
      navigate("/dashboard");
    } catch (err) {
      setError(typeof err === "string" ? err : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="backdrop-blur-xs bg-white/30 shadow-2xl p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white text-center mb-6 drop-shadow">
          Welcome Back
        </h1>

        {error && (
          <p className="text-red-600 bg-white/50 px-2 py-1 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            className="w-full px-4 py-2 mb-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-700"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-cyan-300" : "bg-cyan-400 hover:bg-cyan-500"
            } text-white font-bold py-2 rounded`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
