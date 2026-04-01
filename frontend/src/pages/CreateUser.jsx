import { useState } from "react";
import Layout from "../components/Layout";
import { createUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const CreateUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await createUser(form);
    alert(res.message || "User Created Successfully");

    navigate("/users");   // Users page
    window.location.reload();  // Reload data
  } catch (err) {
    console.log("Create User Error:", err);
    alert("Error creating user");
  }
};

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New User
          </h2>
          <p className="text-gray-500 text-sm">
            Add a new user to your tenant
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="border p-2 w-full rounded-md"
              placeholder="Enter name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="border p-2 w-full rounded-md"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="border p-2 w-full rounded-md pr-10"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <span
                className="absolute right-3 top-2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateUser;