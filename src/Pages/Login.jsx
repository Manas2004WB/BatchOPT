import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../Data/Data";
import bcrypt from "bcryptjs";
import heroBg from "../assets/hero-bg.jpg";

const Login = ({ setUser }) => {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const foundUser = users.find((u) => u.email === login.email);
    if (!foundUser) return setError("Invalid email");
    if (!bcrypt.compareSync(login.password, foundUser.password_hash))
      return setError("Incorrect password");
    if (!foundUser.is_active) return setError("User inactive");

    // ✅ Save to localStorage
    localStorage.setItem("user", JSON.stringify(foundUser));

    setUser(foundUser);
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroBg})`, // Replace with your preferred image
      }}
    >
      {/* <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md ">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="text-white text-3xl font-bold tracking-wide drop-shadow">Batch Optimization</div>
            <div className="space-x-6 text-white font-medium text-sm drop-shadow">
              <a href="#">SKU</a>
              <a href="#">Tinters</a>
              <a href="#">Batches</a>
              <a href="#">Plants</a>
            </div>
          </div>
        </nav> */}
      <div className="backdrop-blur-xs bg-white/30 shadow-2xl p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-white text-center mb-6 drop-shadow">
          Welcome Back
        </h1>
        <div>
          {error && (
            <p className="text-red-600 bg-white/50 px-2 py-1 rounded mb-4">
              {error}
            </p>
          )}

          <input
            type="text"
            placeholder="Email"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            className="w-full px-4 py-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-300"
          />

          <input
            type="password"
            placeholder="Password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            className="w-full px-4 py-2 mb-6 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500  text-gray-300"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-bold py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
