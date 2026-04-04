import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/dashboard">
                    Sistema
                </Link>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">
                                Dashboard
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/clientes">
                                Clientes
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/agendamentos">
                                Agendamentos
                            </Link>
                        </li>

                        {/*admin*/}
                        {isAdmin() && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">
                                    Usuários
                                </Link>
                            </li>
                        )}
                    </ul>

                    <button className="btn btn-outline-light" onClick={handleLogout}>
                        Sair
                    </button>
                </div>
            </div>
        </nav>
    );
}