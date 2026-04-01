import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { getRoles } from "../services/api";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

const fetchRoles = async () => {
  const data = await getRoles();
  console.log("Roles Data:", data); // DEBUG
  setRoles(data);
};

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this role?")) return;

    try {
      await deleteRole(id);
      fetchRoles();
    } catch (err) {
      alert("Cannot delete role assigned to users");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Roles Management
          </h2>
          <p className="text-gray-500 text-sm">
            Manage roles and permissions
          </p>
        </div>

        <button
          onClick={() => navigate("/create-role")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Create Role
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-3 text-left">Role ID</th>
              <th className="p-3 text-left">Role Name</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((r) => (
              <tr
                key={r.RoleId}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{r.RoleId}</td>
                <td className="p-3">{r.RoleName}</td>

                <td className="p-3">
                  <button
                    onClick={() => handleDelete(r.RoleId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Roles;