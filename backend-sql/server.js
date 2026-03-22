const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connect
connectDB();


app.use("/api/auth", authRoutes);

// Test Route

app.get("/", (req, res) => {
  res.send("SQL RBAC Backend Running 🚀");
});
app.use("/api", userRoutes);
app.use("/api", roleRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});