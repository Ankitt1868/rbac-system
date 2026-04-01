import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import CreateRole from "./pages/CreateRole";
import AssignRole from "./pages/AssignRole";
import RolePermissions from "./pages/RolePermissions";
import ProtectedRoute from "./components/ProtectedRoute";
import EditUser from "./pages/EditUser";
import Roles from "./pages/Roles";
import Tenants from "./pages/Tenants";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tenants" element={<Tenants />} />

      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roles"
        element={
          <ProtectedRoute>
            <Roles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-user"
        element={
          <ProtectedRoute>
            <CreateUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-role"
        element={
          <ProtectedRoute>
            <CreateRole />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assign-role"
        element={
          <ProtectedRoute>
            <AssignRole />
          </ProtectedRoute>
        }
      />

      <Route
        path="/role-permissions"
        element={
          <ProtectedRoute>
            <RolePermissions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-user/:id"
        element={
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        }
      />

      {/* Unknown route redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;