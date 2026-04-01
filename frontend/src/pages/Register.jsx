import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tenantName: "",
    subdomain: "",
    adminName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/register-tenant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Organization Registered Successfully");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-96">
        <h2 className="text-xl font-bold text-center mb-6">
          Register Organization
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Organization Name"
            className="border p-2 rounded-md"
            onChange={(e) =>
              setForm({ ...form, tenantName: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Subdomain"
            className="border p-2 rounded-md"
            onChange={(e) =>
              setForm({ ...form, subdomain: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Admin Full Name"
            className="border p-2 rounded-md"
            onChange={(e) =>
              setForm({ ...form, adminName: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Admin Email"
            className="border p-2 rounded-md"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* Password show hide */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border p-2 rounded-md w-full"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <div
              className="absolute right-3 top-2.5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <button className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-2">
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;