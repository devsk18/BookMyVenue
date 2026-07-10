import keycloak from '../../configs/keycloak';

/**
 * Conditionally renders children based on the user's user_type.
 * @param {Array} allowedRoles - e.g., ['venue_owner', 'user']
 */
export default function RoleGuard({ allowedRoles, children }) {
  const userRole = keycloak.tokenParsed?.user_role;

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return null;
}