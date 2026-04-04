import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        setUser({
          id: decoded.id,
          tipo: decoded.tipo,
          token
        });
      } catch (e) {
        logout();
      }
    }
  }, []);

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token } = response.data;

    const decoded = jwtDecode(token);

    const userData = {
      id: decoded.id,
      tipo: decoded.tipo,
      token
    };

    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  const isAdmin = () => user?.tipo === 'admin';
  const isFuncionario = () => user?.tipo === 'funcionario';
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin,
        isFuncionario,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);