import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRoles, setTotalRoles] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        console.log("Dashboard Data:", data);

        setTotalUsers(data.totalUsers);
        setTotalRoles(data.totalRoles);
        setTotalTenants(data.totalTenants);
      } catch (error) {
        console.log("Dashboard Error:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500">
          Welcome to your SaaS platform dashboard
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg">
          <h2>Total Users</h2>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-lg">
          <h2>Total Roles</h2>
          <p className="text-3xl font-bold">{totalRoles}</p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-lg">
          <h2>Total Tenants</h2>
          <p className="text-3xl font-bold">{totalTenants}</p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;