import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { createRole } from "../services/api";

const CreateRole = () => {
  const [roleName, setRoleName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName) {
      alert("Please enter role name");
      return;
    }

    try {
      const res = await createRole({ roleName });

      console.log("API Response:", res);

      alert("Role Created Successfully");
      navigate("/roles");

    } catch (err) {
      console.log("Create Role Error:", err);
      alert("Error creating role");
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Role
          </h2>
          <p className="text-gray-500 text-sm">
            Create a new role for role-based access control
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          <div>
            <label className="block text-sm mb-1">Role Name</label>
            <input
              className="border p-2 w-full rounded-md"
              placeholder="Enter role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateRole;