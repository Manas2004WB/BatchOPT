// components/Navbar.jsx
import React from "react";

const Navbar = ({ user }) => {
  return (
    <div className="w-full bg-white/60 backdrop-blur-md shadow-md px-8 py-4 flex justify-between items-center fixed top-0 left-0 z-50 ">
      <h2 className="text-xl font-bold text-gray-800">
        Welcome, {user.Username}!
      </h2>
      <p className="text-gray-700 font-medium">Email: {user.Email}</p>
    </div>
  );
};

export default Navbar;
