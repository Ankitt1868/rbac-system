import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { updateUser, getUsers, getRoles, assignRole } from "../services/api";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    tenantId: "",
  });

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  // Fetch User
  useEffect(() => {
    const fetchUser = async () => {
      const users = await getUsers();
      const user = users.find((u) => u.UserId == id);

      if (user) {
        setForm({
          name: user.Name || "",
          email: user.Email || "",
          tenantId: user.TenantId || "",
        });

        if (user.RoleId) {
          setSelectedRole(user.RoleId);
        }
      }
    };

    fetchUser();
  }, [id]);

  // Fetch Roles
  useEffect(() => {
    const fetchRoles = async () => {
      const data = await getRoles();
      setRoles(data);
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update User Info
    await updateUser(id, form);

    // Update Role
    if (selectedRole) {
      await assignRole(id, selectedRole);
    }

    alert("User Updated Successfully");
    navigate("/users");
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit User
          </h2>
          <p className="text-gray-500 text-sm">
            Update user information
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="border p-2 w-full rounded-md"
              value={form.name || ""}
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
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Tenant ID */}
          <div>
            <label className="block text-sm mb-1">Tenant ID</label>
            <input
              className="border p-2 w-full rounded-md"
              value={form.tenantId || ""}
              onChange={(e) =>
                setForm({ ...form, tenantId: e.target.value })
              }
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              className="border p-2 w-full rounded-md"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.RoleId} value={r.RoleId}>
                  {r.RoleName}
                </option>
              ))}
            </select>
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
              Update User
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditUser;