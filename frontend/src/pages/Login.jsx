import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";

const Login = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      if (res.token) {
        login(res);
        alert("Login successful");
      } else {
        alert(res.message);

        // 🔥 NEW UX LOGIC
        if (res.message === "User not found") {
          const goToRegister = window.confirm(
            "User not found. Do you want to create an account?"
          );

          if (goToRegister) {
            window.location.href = "/register";
          }
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>

      {/* 🔥 BONUS UI */}
      <p style={{ marginTop: "10px" }}>
        Don’t have an account? <a href="/register">Create Account</a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "50px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    margin: "auto",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
  },
  button: {
    padding: "10px",
    background: "#333",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Login;