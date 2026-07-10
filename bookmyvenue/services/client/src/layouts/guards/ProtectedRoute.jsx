import { Navigate, Outlet } from 'react-router-dom';
import keycloak from '../../configs/keycloak';

export default function ProtectedRoute({ allowedRoles }) {
  if (!keycloak.authenticated) {
    return <Navigate to="/" replace />;
  }
  const userRole = keycloak.tokenParsed?.user_role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}