import React, { useState } from "react";
import Login from "./Pages/Login";
import { getStoredUser } from "./utility/authUtils";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import PlantDetails from "./Pages/PlantDetails";
import ShotsPage from "./Pages/ShotsPage";
import MainComponent from "./Pages/MainComponent";

const App = () => {
  // ✅ Initialize user state from secure JWT, not localStorage.user
  const [user, setUser] = useState(() => getStoredUser());
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                user={user}
                handleLogout={handleLogout}
                setUser={setUser}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/plant/:id"
          element={
            user ? (
              <PlantDetails user={user} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/shots/:batchId"
          element={
            user ? <ShotsPage user={user} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/setting"
          element={
            getStoredUser()?.role === "Admin" ? (
              <MainComponent user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all → redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
