import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getUsers, assignRole } from "../services/api";
import { useNavigate } from "react-router-dom";

const AssignRole = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUsers();
      setUsers(userData);

      setRoles([
        { RoleId: 1, RoleName: "Admin" },
        { RoleId: 2, RoleName: "Manager" },
        { RoleId: 3, RoleName: "Employee" },
      ]);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !roleId) {
      alert("Please select user and role");
      return;
    }

    try {
      await assignRole({
        userId,
        roleId,
      });

      alert("Role Assigned Successfully");
      navigate("/users");
    } catch (error) {
      console.log("Assign Role Error:", error);
      alert("Error assigning role");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Assign Role to User
          </h2>
          <p className="text-gray-500 text-sm">
            Select a user and assign a role
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          {/* Select User */}
          <div>
            <label className="block text-sm mb-1">
              Select User
            </label>
            <select
              className="border p-2 w-full rounded-md"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.UserId} value={u.UserId}>
                  {u.Name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Role */}
          <div>
            <label className="block text-sm mb-1">
              Select Role
            </label>
            <select
              className="border p-2 w-full rounded-md"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
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
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Assign Role
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AssignRole;