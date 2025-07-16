import React, { useEffect, useState } from "react";
import Login from "./Pages/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import PlantDetails from "./Pages/PlantDetails";
import ShotsPage from "./Pages/ShotsPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // <-- mark loading complete
  }, []);
  if (loading) return null;
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
            }
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/plant/:id"
            element={user ? <PlantDetails user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/shots/:batchId"
            element={user ? <ShotsPage user={user} /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
