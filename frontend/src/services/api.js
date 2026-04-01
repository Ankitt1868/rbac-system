import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token + Tenant automatically add
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  const tenantId = localStorage.getItem("tenantId");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  if (tenantId) {
    req.headers["tenant-id"] = tenantId;
  }

  return req;
});

// Login
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// Users
export const getUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const createUser = async (data) => {
  const res = await API.post("/users", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await API.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};

// Roles
export const getRoles = async () => {
  const res = await API.get("/roles");
  return res.data;
};

export const createRole = async (data) => {
  const res = await API.post("/roles", data);
  return res.data;
};

export const assignRole = async (userId, roleId) => {
  const res = await API.post("/roles/assign-role", {
    userId,
    roleId,
  });
  return res.data;
};

// ⭐ IMPORTANT – Role Permissions
export const getRolePermissions = async (roleId) => {
  const res = await API.get(`/roles/role-permissions/${roleId}`);
  return res.data;
};

export const assignPermissions = async (roleId, permissions) => {
  const res = await API.post("/roles/assign-permissions", {
    roleId,
    permissions,
  });
  return res.data;
};

// Dashboard
export const getDashboardStats = async () => {
  const res = await API.get("/dashboard-stats");
  return res.data;
};

// Tenants
export const getTenants = async () => {
  const res = await API.get("/tenants");
  return res.data;
};

export const deleteTenant = async (id) => {
  const res = await API.delete(`/tenants/${id}`);
  return res.data;
};

export const switchTenant = async (tenantId) => {
  const res = await API.post("/switch-tenant", { tenantId });
  localStorage.setItem("tenantId", tenantId);
  return res.data;
};

export const deleteRole = async (id) => {
  const res = await API.delete(`/roles/${id}`);
  return res.data;
};

// GET ALL PERMISSIONS  ← YE IMPORTANT HAI
export const getPermissions = async () => {
  const res = await API.get("/permissions");
  return res.data;
};

export default API;