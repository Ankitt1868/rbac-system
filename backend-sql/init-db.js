require("dotenv").config();
const pool = require("./config/db");

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Tenants (
        TenantId SERIAL PRIMARY KEY,
        TenantName VARCHAR(100),
        Subdomain VARCHAR(100),
        CreatedAt TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Users (
        UserId SERIAL PRIMARY KEY,
        Name VARCHAR(100),
        Email VARCHAR(100),
        Password VARCHAR(200),
        TenantId INT REFERENCES Tenants(TenantId)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Roles (
        RoleId SERIAL PRIMARY KEY,
        RoleName VARCHAR(100),
        TenantId INT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Permissions (
        PermissionId SERIAL PRIMARY KEY,
        PermissionName VARCHAR(100)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS UserRoles (
        UserId INT,
        RoleId INT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS RolePermissions (
        RoleId INT,
        PermissionId INT
      );
    `);

    await pool.query(`
      INSERT INTO Permissions (PermissionName) VALUES
      ('View Dashboard'),
      ('View Users'),
      ('Create User'),
      ('Edit User'),
      ('Delete User'),
      ('View Roles'),
      ('Create Role'),
      ('Assign Role'),
      ('Assign Permissions')
      ON CONFLICT DO NOTHING;
    `);

    console.log("Database Initialized Successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

initDB();