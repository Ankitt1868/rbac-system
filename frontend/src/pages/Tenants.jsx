import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getTenants, deleteTenant } from "../services/api";

const Tenants = () => {
  const [tenants, setTenants] = useState([]);

  const fetchTenants = async () => {
    const data = await getTenants();
    setTenants(data);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleDelete = async (id) => {
    await deleteTenant(id);
    fetchTenants();
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Tenants</h2>

      <table className="w-full bg-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Subdomain</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tenants.map((t) => (
            <tr key={t.TenantId}>
              <td>{t.TenantId}</td>
              <td>{t.TenantName}</td>
              <td>{t.Subdomain}</td>
              <td>
                <button
                  onClick={() => handleDelete(t.TenantId)}
                  className="bg-red-500 text-white px-3 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Tenants;