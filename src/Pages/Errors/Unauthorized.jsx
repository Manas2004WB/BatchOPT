// src/pages/Error/Unauthorized.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#3dcd58]/20 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center animate-fadeIn">
        <h1 className="text-6xl font-extrabold text-red-500 mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-green-500 mb-2">
          Unauthorized
        </h2>
        <p className="text-black mb-6">
          You do not have permission to access this page. Please login with an
          account that has the proper privileges.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
