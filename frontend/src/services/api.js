const API = "http://localhost:5000/api";

// Login API
export const loginUser = async (data) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};