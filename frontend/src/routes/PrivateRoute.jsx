import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, role }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  if (role === 'admin' && !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}