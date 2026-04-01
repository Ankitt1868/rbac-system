import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import api, { getUsers } from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      console.log("Fetch users error", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.log("Delete error", err);
    }
  };

  // Edit User
  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  // Search Filter
  const filteredUsers = users.filter((u) =>
    (u.Name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Users Management
          </h2>
          <p className="text-gray-500 text-sm">
            Manage all users in your tenant
          </p>
        </div>

        <button
          onClick={() => navigate("/create-user")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          placeholder="Search users..."
          className="border p-2 rounded-md w-64"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Tenant</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.UserId} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.UserId}</td>
                <td className="p-3">{u.Name}</td>
                <td className="p-3">{u.Email}</td>
                <td className="p-3">{u.TenantName}</td>

                <td className="p-3">
                  {u.RoleName ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                      {u.RoleName}
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                      No Role
                    </span>
                  )}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => handleEdit(u.UserId)}
                    className="bg-yellow-400 px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u.UserId)}
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

export default Users;