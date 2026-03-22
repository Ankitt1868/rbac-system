import { useEffect, useState } from "react";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  // 🔥 Get all users
  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsers(data);
  };

  // 🔥 Assign role
  const assignRole = async (userId) => {
    const roleId = prompt("Enter Role ID (Admin / Manager / User)");

    if (!roleId) return;

    await fetch("http://localhost:5000/api/users/assign-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, roleId }),
    });

    alert("Role Updated");
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel 🔥</h2>

      {users.map((user) => (
        <div
          key={user._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
          }}
        >
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>

          <button onClick={() => assignRole(user._id)}>
            Change Role
          </button>
        </div>
      ))}
    </div>
  );
};

export default Admin;