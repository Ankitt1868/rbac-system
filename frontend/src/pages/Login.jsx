import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

const handleLogin = async (e) => {
  e.preventDefault();

  const data = await loginUser({ email, password });

  if (data.token) {
    // Save token
    localStorage.setItem("token", data.token);

    // Save user info
    localStorage.setItem("user", JSON.stringify(data.user));

    // Save permissions
    localStorage.setItem(
      "permissions",
      JSON.stringify(data.permissions || [])
    );

    // Save tenantId
    localStorage.setItem("tenantId", data.user.TenantId);

    // Auth context login
    login(data.token);

    navigate("/dashboard");
  } else {
    alert("Invalid email or password");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            className="border p-2 rounded-md"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password with show/hide */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border p-2 rounded-md w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute right-3 top-2.5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <button className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Create Organization
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;