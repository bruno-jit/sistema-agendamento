import { useState } from 'react';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'funcionario'
  });

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/auth/register', form);

      setMensagem('Usuário cadastrado com sucesso!');
      setErro('');
      setForm({ nome: '', email: '', senha: '', tipo: 'funcionario' });
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar');
      setMensagem('');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Cadastro de Usuário</h2>

      {mensagem && <div className="alert alert-success">{mensagem}</div>}
      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            className="form-control"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de Usuário</label>
          <select
            className="form-control"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
          >
            <option value="funcionario">Funcionário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button className="btn btn-primary w-100">
          Cadastrar
        </button>
      </form>
    </div>
  );
}