// RoleBasedUI Component - Handles role-based rendering and access control
import React from "react";
import { useAuth } from "../context/AuthContext";

const RoleBasedUI = ({
  children,
  allowedRoles = [],
  fallback = null,
  requireAllRoles = false
}) => {
  const { user } = useAuth();

  if (!user) {
    return fallback || null;
  }

  const userRole = user.role?.toLowerCase();

  if (allowedRoles.length === 0) {
    // No role restrictions, show to all authenticated users
    return children;
  }

  const allowedRolesLower = allowedRoles.map(role => role.toLowerCase());

  if (requireAllRoles) {
    // User must have ALL specified roles
    const hasAllRoles = allowedRolesLower.every(role => userRole === role);
    return hasAllRoles ? children : (fallback || null);
  } else {
    // User must have at least ONE of the specified roles
    const hasRole = allowedRolesLower.includes(userRole);
    return hasRole ? children : (fallback || null);
  }
};

// Higher-order component for role-based rendering
export const withRoleAccess = (Component, allowedRoles = [], options = {}) => {
  return (props) => (
    <RoleBasedUI allowedRoles={allowedRoles} {...options}>
      <Component {...props} />
    </RoleBasedUI>
  );
};

// Hook for checking role permissions
export const useRoleAccess = () => {
  const { user } = useAuth();

  const hasRole = (roles = [], requireAll = false) => {
    if (!user) return false;

    const userRole = user.role?.toLowerCase();
    const rolesLower = roles.map(role => role.toLowerCase());

    if (requireAll) {
      return rolesLower.every(role => userRole === role);
    } else {
      return rolesLower.includes(userRole);
    }
  };

  const isAdmin = () => hasRole(['admin']);
  const isManager = () => hasRole(['admin', 'manager']);
  const isUser = () => hasRole(['admin', 'manager', 'user']);

  return {
    hasRole,
    isAdmin,
    isManager,
    isUser,
    userRole: user?.role?.toLowerCase(),
    user
  };
};

export default RoleBasedUI;
