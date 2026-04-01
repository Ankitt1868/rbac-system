import Sidebar from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { getTenants, switchTenant } from "../services/api";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(
    localStorage.getItem("tenantId")
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("tenantId");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const pageName = location.pathname
    .replace("/", "")
    .replace("-", " ")
    .toUpperCase();

  // Fetch Tenants
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await getTenants();
        setTenants(data);
      } catch (err) {
        console.log("Tenant fetch error", err);
      }
    };

    if (user?.RoleName === "Super Admin") {
      fetchTenants();
    }
  }, []);

  // Switch Tenant
  const handleTenantSwitch = async (tenantId) => {
    setSelectedTenant(tenantId);
    await switchTenant(tenantId);
    localStorage.setItem("tenantId", tenantId);
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <span className="text-gray-500 font-medium ml-2">
              {pageName}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Tenant Switch */}
            {user?.RoleName === "Super Admin" && (
              <select
                value={selectedTenant}
                onChange={(e) => handleTenantSwitch(e.target.value)}
                className="border px-3 py-1 rounded-md"
              >
                <option value="">Select Tenant</option>
                {tenants.map((t) => (
                  <option key={t.TenantId} value={t.TenantId}>
                    {t.TenantName}
                  </option>
                ))}
              </select>
            )}

            <span className="text-gray-600 font-medium">
              {user?.Name} ({user?.RoleName})
            </span>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;