import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <div>
      <Navbar />

       <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />

      {/* Protected Routes */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Roles />
            </ProtectedRoute>
          }
        />
      </Routes>

    </div>
  );
}

export default App;