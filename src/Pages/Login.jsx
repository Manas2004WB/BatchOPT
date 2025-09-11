import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import heroBg from "../assets/hero-bg.jpg";
import BatchOptLogin from "../assets/BatchOptLogin.png";

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

      localStorage.setItem("token", data.Token);
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data);
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
      {/* Container for Image + Form */}
      <div className="flex bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full animate-fadeIn">
        {/* Left Image Section */}
        <div className="hidden md:flex items-center justify-center p-8 w-1/2">
          <img
            src={BatchOptLogin}
            alt="BatchOpt Login"
            className="max-h-80 object-contain drop-shadow-lg"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-4xl font-extrabold text-white text-center mb-4 drop-shadow-lg">
            Welcome Back
          </h1>

          {/* Error Message */}
          <div className="h-8 mb-6 flex items-center justify-center">
            {error ? (
              <p className="text-red-600 bg-white/70 backdrop-blur px-3 py-1 rounded-lg text-sm font-medium shadow">
                {error}
              </p>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/30 transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/40 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/30 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-cyan-300 cursor-not-allowed"
                  : "bg-cyan-400 hover:bg-cyan-500 hover:scale-[1.02]"
              } text-white font-bold py-3 rounded-xl shadow-md transition transform`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
