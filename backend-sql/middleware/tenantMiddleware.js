const tenantMiddleware = (req, res, next) => {
  const tenantId = req.headers["tenant-id"];

  if (tenantId) {
    req.tenantId = parseInt(tenantId);
  }

  // If not SuperAdmin and no tenant
  if (!req.tenantId && req.user.RoleName !== "SuperAdmin") {
    return res.status(403).json({
      message: "Tenant access required",
    });
  }

  next();
};

module.exports = tenantMiddleware;