import { useEffect, useState } from 'react';
import { getProfissionais, createProfissional, deleteProfissional } from '../services/profissionalService';

export default function Profissionais() {
    const [profissionais, setProfissionais] = useState([]);
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const carregarProfissionais = async () => {
        try {
            const res = await getProfissionais();
            setProfissionais(res.data);
        } catch (err) {
            setErro('Erro ao carregar lista de profissionais.');
        }
    };

    useEffect(() => {
        carregarProfissionais();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        try {
            await createProfissional({ nome, telefone, ativo: true });
            setSucesso('Profissional cadastrado com sucesso!');
            setNome('');
            setTelefone('');
            carregarProfissionais();
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao cadastrar profissional.');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Deseja realmente remover este profissional?')) {
            try {
                await deleteProfissional(id);
                carregarProfissionais();
            } catch (err) {
                setErro('Erro ao excluir profissional.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Gestão de Profissionais</h2>

            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Novo Profissional</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nome do Profissional"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Telefone (ex: 88 99999-9999)"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-success w-100">
                                Cadastrar
                            </button>
                        </div>
                    </form>
                    {erro && <div className="alert alert-danger mt-3 p-2 small">{erro}</div>}
                    {sucesso && <div className="alert alert-success mt-3 p-2 small">{sucesso}</div>}
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Status</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profissionais.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted">Nenhum profissional cadastrado.</td>
                                </tr>
                            ) : (
                                profissionais.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.nome}</td>
                                        <td>{p.telefone || '-'}</td>
                                        <td>
                                            <span className={`badge ${p.ativo ? 'bg-success' : 'bg-secondary'}`}>
                                                {p.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}