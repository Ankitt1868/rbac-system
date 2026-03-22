const sql = require("mssql");

const config = {
  user: "rbac_user",
  password: "123456",
  server: "localhost",
  database: "RBAC_Tenant_DB",
  port: 1433,
  options: {
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  try {
    await sql.connect(config);
    console.log("SQL Server Connected ✅");
  } catch (err) {
    console.log("DB Connection Error:", err);
  }
};

module.exports = { sql, connectDB };