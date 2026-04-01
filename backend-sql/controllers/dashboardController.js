// const { sql } = require("../config/db");

// const getStats = async (req, res) => {
//   try {
//     const roleName = req.user.RoleName;
//     const tenantId = req.tenantId || req.user.TenantId;

//     let totalUsers = 0;
//     let totalRoles = 0;
//     let totalTenants = 0;

//     if (roleName === "Super Admin") {
//       const users = await sql.query`SELECT COUNT(*) AS count FROM Users`;
//       const roles = await sql.query`SELECT COUNT(*) AS count FROM Roles`;
//       const tenants = await sql.query`SELECT COUNT(*) AS count FROM Tenants`;

//       totalUsers = users.recordset[0].count;
//       totalRoles = roles.recordset[0].count;
//       totalTenants = tenants.recordset[0].count;
//     } else {
//       const users = await sql.query`
//         SELECT COUNT(*) AS count 
//         FROM Users 
//         WHERE TenantId = ${tenantId}
//       `;

//       const roles = await sql.query`
//         SELECT COUNT(DISTINCT ur.RoleId) AS count
//         FROM UserRoles ur
//         JOIN Users u ON ur.UserId = u.UserId
//         WHERE u.TenantId = ${tenantId}
//       `;

//       totalUsers = users.recordset[0].count;
//       totalRoles = roles.recordset[0].count;
//       totalTenants = 1;
//     }

//     res.json({
//       totalUsers,
//       totalRoles,
//       totalTenants,
//     });
//   } catch (err) {
//     console.log("Dashboard Stats Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { getStats };



// PostgreSQL Converted File (dashboardController.js)


const pool = require("../config/db");

const getStats = async (req, res) => {
  try {
    const roleName = req.user.RoleName;
    const tenantId = req.tenantId || req.user.TenantId;

    let totalUsers = 0;
    let totalRoles = 0;
    let totalTenants = 0;

    if (roleName === "Super Admin") {
      const users = await pool.query(
        "SELECT COUNT(*) AS count FROM Users"
      );
      const roles = await pool.query(
        "SELECT COUNT(*) AS count FROM Roles"
      );
      const tenants = await pool.query(
        "SELECT COUNT(*) AS count FROM Tenants"
      );

      totalUsers = users.rows[0].count;
      totalRoles = roles.rows[0].count;
      totalTenants = tenants.rows[0].count;
    } else {
      const users = await pool.query(
        "SELECT COUNT(*) AS count FROM Users WHERE TenantId = $1",
        [tenantId]
      );

      const roles = await pool.query(
        `SELECT COUNT(DISTINCT ur.RoleId) AS count
         FROM UserRoles ur
         JOIN Users u ON ur.UserId = u.UserId
         WHERE u.TenantId = $1`,
        [tenantId]
      );

      totalUsers = users.rows[0].count;
      totalRoles = roles.rows[0].count;
      totalTenants = 1;
    }

    res.json({
      totalUsers,
      totalRoles,
      totalTenants,
    });
  } catch (err) {
    console.log("Dashboard Stats Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStats };