import React, { useEffect, useState } from "react"
import Login from "./Pages/Login"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from "./Pages/Dashboard";

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  return (
    <div>
      
      <Router>
        <Routes>  
           <Route path="/" element={
          user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
          } />
          <Route path="/dashboard" element={
          user ? <Dashboard user={user} /> : <Navigate to="/" />
           } /> 
        </Routes>
      </Router>
    </div>
  )
}

export default App