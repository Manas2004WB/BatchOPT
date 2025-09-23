import React, { useState } from "react";
import Login from "./Pages/Login";
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
  // ✅ Initialize directly from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const handleLogout = () => {
    // Clear user session (e.g., remove token from localStorage)
    localStorage.clear();
    setUser(null); // Update user state in App component
  };

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Root route → redirect if logged in */}
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
            user?.UserId === 10 ? (
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
