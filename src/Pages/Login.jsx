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
    <div className="min-h-screen bg-[#3dcd58]/20 flex items-center justify-center">
      {/* Container for Image + Form */}
      <div className="flex bg-white  shadow-2xl overflow-hidden max-w-4xl w-full animate-fadeIn border border-[#3dcd58]/30">
        {/* Left Image Section */}
        <div className="hidden md:flex items-center justify-center p-8 w-1/2 bg-[#3dcd58]/10">
          <img
            src={BatchOptLogin}
            alt="BatchOpt Login"
            className="max-h-80 object-contain drop-shadow-lg"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-4xl font-extrabold text-[#3dcd58] text-center mb-4 drop-shadow">
            Welcome Back
          </h1>

          {/* Error Message */}
          <div className="h-8 mb-6 flex items-center justify-center">
            {error ? (
              <p className="text-red-600 bg-white/90 backdrop-blur px-3 py-1 text-sm font-medium shadow">
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
              className="w-full px-4 py-3  bg-[#3dcd58]/10 border border-[#3dcd58]/30 text-[#3dcd58] placeholder-[#3dcd58] focus:outline-none focus:ring-2 focus:ring-[#3dcd58] focus:bg-white transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              className="w-full px-4 py-3  bg-[#3dcd58]/10 border border-[#3dcd58]/30 text-[#3dcd58] placeholder-[#3dcd58] focus:outline-none focus:ring-2 focus:ring-[#3dcd58] focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-[#3dcd58]/70 cursor-not-allowed"
                  : "bg-[#3dcd58] hover:bg-[#32b84a] hover:scale-[1.02]"
              } text-white font-bold py-3  shadow-md transition transform`}
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
