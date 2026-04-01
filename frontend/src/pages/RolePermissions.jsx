import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import {
  getRoles,
  getRolePermissions,
  assignPermissions,
  getPermissions
} from "../services/api";

const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  const fetchPermissions = async () => {
    const data = await getPermissions();
    setAllPermissions(data);
  };

  const loadRolePermissions = async (id) => {
    const data = await getRolePermissions(id);
    const existing = data.map((p) => p.PermissionId);
    setPermissions(existing);
  };

  const handleRoleChange = (e) => {
    const id = e.target.value;
    setRoleId(id);
    loadRolePermissions(id);
  };

  const handleCheck = (permissionId) => {
    if (permissions.includes(permissionId)) {
      setPermissions(permissions.filter((p) => p !== permissionId));
    } else {
      setPermissions([...permissions, permissionId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await assignPermissions(roleId, permissions);
    alert("Permissions Assigned Successfully");
    navigate("/roles");
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Assign Permissions to Role
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
          <div>
            <label className="block text-sm mb-1">Select Role</label>
            <select
              className="border p-2 w-full rounded-md"
              value={roleId}
              onChange={handleRoleChange}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.RoleId} value={role.RoleId}>
                  {role.RoleName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {allPermissions.map((p) => (
                <label key={p.PermissionId} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={permissions.includes(p.PermissionId)}
                    onChange={() => handleCheck(p.PermissionId)}
                  />
                  {p.PermissionName}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate("/roles")}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Assign Permissions
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default RolePermissions;