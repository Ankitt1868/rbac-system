import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div style={styles.navbar}>
      <h3>RBAC System</h3>

      <div>
        <Link to="/" style={styles.link}>Dashboard</Link>

        {/* Show only for Admin */}
       {user && user.role && user.role.name === "Admin" && (
  <div>
    <Link to="/admin" style={styles.link}>Admin Panel</Link>
    <Link to="/users" style={styles.link}>Users</Link>
    <Link to="/roles" style={styles.link}>Roles</Link>
  </div>
)}

        {!user ? (
          <Link to="/login" style={styles.link}>Login</Link>
        ) : (
          <button onClick={logout} style={styles.btn}>Logout</button>
        )}
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#333",
    color: "#fff",
  },
  link: {
    marginLeft: "15px",
    color: "#fff",
    textDecoration: "none",
  },
  btn: {
    marginLeft: "15px",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default Navbar;