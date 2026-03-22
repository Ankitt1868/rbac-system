import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Role check
  if (!allowedRoles.includes(user.role)) {
    return <h2 style={{ textAlign: "center" }}>Access Denied</h2>;
  }

  return children;
};

export default ProtectedRoute;