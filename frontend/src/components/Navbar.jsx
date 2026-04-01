import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bell, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full bg-white shadow px-6 py-3 flex justify-between items-center">
      {/* Left */}
      <div className="flex items-center gap-4">
        <h1 className="font-bold text-lg text-blue-600">
          SaaS Platform
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 text-white px-3 py-1 rounded-md"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-400 text-white px-3 py-1 rounded-md"
        >
          Back
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 relative">
        {/* Notification */}
        <Bell className="cursor-pointer" />

        {/* Profile */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <User />
          <span>Admin</span>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-10 bg-white shadow-lg rounded-md w-40">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>

            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;