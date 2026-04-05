import { useEffect, useState } from 'react';
import { getServicos, createServico, deleteServico } from '../services/servicoService';

export default function Servicos() {
    const [servicos, setServicos] = useState([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [duracaoMinutos, setDuracaoMinutos] = useState('');
    
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const carregarServicos = async () => {
        try {
            const res = await getServicos();
            setServicos(res.data);
        } catch (err) {
            setErro('Erro ao carregar lista de serviços.');
        }
    };

    useEffect(() => {
        carregarServicos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        try {
            await createServico({ 
                nome, 
                descricao, 
                preco: parseFloat(preco), 
                duracao_minutos: parseInt(duracaoMinutos) 
            });
            
            setSucesso('Serviço cadastrado com sucesso!');
            
            setNome('');
            setDescricao('');
            setPreco('');
            setDuracaoMinutos('');
            
            carregarServicos();
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao cadastrar serviço.');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Deseja realmente remover este serviço? Isso pode afetar agendamentos vinculados.')) {
            try {
                await deleteServico(id);
                carregarServicos();
            } catch (err) {
                setErro('Erro ao excluir serviço.');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Gestão de Serviços</h2>

            {/* FORMULÁRIO DE CADASTRO */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Novo Serviço</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nome do Serviço</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="col-md-3">
                            <label className="form-label">Preço (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="form-control"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">Duração (Minutos)</label>
                            <input
                                type="number"
                                step="1"
                                min="1"
                                className="form-control"
                                value={duracaoMinutos}
                                onChange={(e) => setDuracaoMinutos(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-12">
                            <label className="form-label">Descrição (Opcional)</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="col-12 text-end">
                            <button type="submit" className="btn btn-success px-4">
                                Cadastrar Serviço
                            </button>
                        </div>
                    </form>
                    
                    {erro && <div className="alert alert-danger mt-3 p-2 small">{erro}</div>}
                    {sucesso && <div className="alert alert-success mt-3 p-2 small">{sucesso}</div>}
                </div>
            </div>

            {/* LISTA DE SERVIÇOS */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Nome</th>
                                <th>Descrição</th>
                                <th>Duração</th>
                                <th>Preço</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servicos.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-3">
                                        Nenhum serviço cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                servicos.map(s => (
                                    <tr key={s.id}>
                                        <td className="fw-bold">{s.nome}</td>
                                        <td className="text-muted small">{s.descricao || '-'}</td>
                                        <td>{s.duracao_minutos} min</td>
                                        <td>R$ {Number(s.preco).toFixed(2)}</td>
                                        <td className="text-center">
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDelete(s.id)}
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