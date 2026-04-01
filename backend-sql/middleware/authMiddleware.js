// const jwt = require("jsonwebtoken");
// const { sql } = require("../config/db");

// const verifyToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];

//     if (!authHeader) {
//       return res.status(401).json({ message: "Token required" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const result = await sql.query`
//       SELECT 
//         u.UserId,
//         u.Name,
//         u.Email,
//         u.TenantId,
//         r.RoleName
//       FROM Users u
//       JOIN UserRoles ur ON u.UserId = ur.UserId
//       JOIN Roles r ON ur.RoleId = r.RoleId
//       WHERE u.UserId = ${decoded.userId}
//     `;

//     if (result.recordset.length === 0) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     const user = result.recordset[0];

//     req.user = user;

//     // Tenant logic
//     if (req.headers["tenant-id"]) {
//       req.tenantId = parseInt(req.headers["tenant-id"]);
//     } else {
//       req.tenantId = user.TenantId;
//     }

//     console.log("Logged User:", req.user);
//     console.log("Current Tenant:", req.tenantId);

//     next();
//   } catch (err) {
//     console.log("Auth Middleware Error:", err);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = verifyToken;


// PostgreSQL Converted File (authMiddleware.js)

const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ message: "Token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT 
        u.UserId,
        u.Name,
        u.Email,
        u.TenantId,
        r.RoleName
      FROM Users u
      JOIN UserRoles ur ON u.UserId = ur.UserId
      JOIN Roles r ON ur.RoleId = r.RoleId
      WHERE u.UserId = $1`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    req.user = user;

    // Tenant logic
    if (req.headers["tenant-id"]) {
      req.tenantId = parseInt(req.headers["tenant-id"]);
    } else {
      req.tenantId = user.tenantid;
    }

    console.log("Logged User:", req.user);
    console.log("Current Tenant:", req.tenantId);

    next();
  } catch (err) {
    console.log("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;