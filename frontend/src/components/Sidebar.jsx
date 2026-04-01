import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Users,
  UserPlus,
  Shield,
  Key,
  Settings,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Permissions from login
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

  const hasPermission = (perm) => {
    return permissions.includes(perm);
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home size={18} />,
      permission: "View Dashboard",
    },
    {
      name: "Users",
      path: "/users",
      icon: <Users size={18} />,
      permission: "View Users",
    },
    {
      name: "Create User",
      path: "/create-user",
      icon: <UserPlus size={18} />,
      permission: "Create User",
    },
    {
      name: "Roles",
      path: "/roles",
      icon: <Shield size={18} />,
      permission: "Create Role",
    },
    {
      name: "Create Role",
      path: "/create-role",
      icon: <Shield size={18} />,
      permission: "Create Role",
    },
    {
      name: "Assign Role",
      path: "/assign-role",
      icon: <Settings size={18} />,
      permission: "Assign Role",
    },
    {
      name: "Role Permissions",
      path: "/role-permissions",
      icon: <Key size={18} />,
      permission: "Assign Role",
    },
  ];

  return (
    <div
      className={`h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && <div className="text-lg font-bold">SaaS RBAC</div>}

        <Menu
          className="cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Menu */}
      <div className="flex flex-col p-2 gap-2">
        {menu
          .filter((item) => hasPermission(item.permission))
          .map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-slate-700"
              }`}
            >
              {item.icon}
              {!collapsed && item.name}
            </Link>
          ))}
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-auto p-4 text-sm text-gray-400">
          Multi-Tenant SaaS
        </div>
      )}
    </div>
  );
};

export default Sidebar;