import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Clientes from '../pages/Clientes';
import Agendamentos from '../pages/Agendamentos';
import Register from '../pages/Register';

import PrivateRoute from './PrivateRoute';
import MainLayout from '../layouts/MainLayout';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Pública */}
        <Route path="/" element={<Login />} />

        {/* 🔒 Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* 👥 Clientes */}
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <MainLayout>
                <Clientes />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* 📅 Agendamentos */}
        <Route
          path="/agendamentos"
          element={
            <PrivateRoute>
              <MainLayout>
                <Agendamentos />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* 👑 Cadastro de usuários (SÓ ADMIN) */}
        <Route
          path="/register"
          element={
            <PrivateRoute role="admin">
              <MainLayout>
                <Register />
              </MainLayout>
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}