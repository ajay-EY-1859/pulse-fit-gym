export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          requiredRole: allowedRoles,
          userRole: user.role,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Role check failed', details: error.message });
    }
  };
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};
