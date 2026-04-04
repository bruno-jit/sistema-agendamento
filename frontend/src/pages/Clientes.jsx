import { useEffect, useState } from 'react';
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente
} from '../services/clienteService';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: '', telefone: '' });
  const [editando, setEditando] = useState(null);

  const carregarClientes = async () => {
    const res = await getClientes();
    setClientes(res.data);
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editando) {
      await updateCliente(editando, form);
    } else {
      await createCliente(form);
    }

    setForm({ nome: '', telefone: '' });
    setEditando(null);
    carregarClientes();
  };
const handleEdit = (cliente) => {
    setForm(cliente);
    setEditando(cliente.id);
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir?')) {
      await deleteCliente(id);
      carregarClientes();
    }
  };
  return (
    <div>
      <h2 className="mb-4">Clientes</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col">
            <input
              className="form-control"
              placeholder="Nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div className="col">
            <input
              className="form-control"
              placeholder="Telefone"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </div>

          <div className="col">
            <button className="btn btn-primary w-100">
              {editando ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </div>
      </form>
      {/* TABELA */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nome}</td>
              <td>{c.telefone}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(c)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(c.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}