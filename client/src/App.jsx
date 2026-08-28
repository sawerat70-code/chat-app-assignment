import { BrowserRouter,Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "./api";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Chat from "./pages/Chat.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ask the server who is logged in.
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout=()=>{
    setUser(null);
  };

  if (loading) return <div className="center">Loading...</div>;

  return (
    <BrowserRouter>
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/chat" /> : <Login onLogin={setUser} />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/chat" /> : <Register setUser={setUser} />}
      />
      <Route
        path="/chat"
        element={user ? <Chat user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to={user ?"/chat" : "/login" } /> } />
    </Routes>
    </BrowserRouter>
  );
}
export default App;