import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <h1>Dashboard 🚀</h1>
      <p>Tipo: {user?.tipo}</p>
    </div>
  );
}