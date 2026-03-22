const authorizePermission = (permissionName) => {
  return async (req, res, next) => {
    const user = req.user;

    await user.populate({
      path: "role",
      populate: {
        path: "permissions",
      },
    });

    const permissions = user.role.permissions.map((p) => p.name);

    if (!permissions.includes(permissionName)) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    next();
  };
};

module.exports = authorizePermission;