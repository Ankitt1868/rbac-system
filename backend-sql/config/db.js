const sql = require("mssql");

const config = {
  user: "rbacuser",
  password: "123456",
  server: "localhost",
  database: "RBAC_DB",
  options: {
    instanceName: "SQLEXPRESS",
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log("SQL Server Connected");
  } catch (err) {
    console.log("DB Connection Error:", err);
  }
};

module.exports = {
  sql,
  connectDB
};