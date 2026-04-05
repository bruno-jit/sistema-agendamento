import { useEffect, useState } from 'react';
import {
    getAgendamentos,
    createAgendamento,
    deleteAgendamento
} from '../services/agendamentoService';
import { getClientes } from '../services/clienteService';
import { getProfissionais } from '../services/profissionalService';
import { getServicos } from '../services/servicoService';

const HORARIO_INICIO = 8;
const HORARIO_FIM = 18;
const INTERVALO_MINUTOS = 30;

export default function Agendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [servicos, setServicos] = useState([]);
    
    const hoje = new Date().toISOString().split('T')[0];
    const [dataSelecionada, setDataSelecionada] = useState(hoje);
    const [clienteId, setClienteId] = useState('');
    const [profissionalId, setProfissionalId] = useState('');
    const [servicoId, setServicoId] = useState('');
    const [erro, setErro] = useState('');

    const carregarDados = async () => {
        try {
            const [ags, cls, profs, servs] = await Promise.all([
                getAgendamentos(), // Certifique-se de que o backend está a devolver todos os agendamentos ou passe os filtros aqui se o seu service suportar
                getClientes(),
                getProfissionais(),
                getServicos()
            ]);

            setAgendamentos(ags.data);
            setClientes(cls.data);
            setProfissionais(profs.data);
            setServicos(servs.data);
        } catch (err) {
            setErro('Erro ao carregar dados do servidor.');
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const gerarHorarios = () => {
        const horarios = [];
        for (let h = HORARIO_INICIO; h < HORARIO_FIM; h++) {
            for (let m = 0; m < 60; m += INTERVALO_MINUTOS) {
                const hora = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                horarios.push(hora);
            }
        }
        return horarios;
    };

    const horarios = gerarHorarios();

    const horarioOcupado = (hora) => {
        // Define o início e fim do slot atual (ex: 08:30 até 09:00)
        const slotInicio = new Date(`${dataSelecionada}T${hora}:00`);
        const slotFim = new Date(slotInicio.getTime() + INTERVALO_MINUTOS * 60000);

        return agendamentos.some(a => {
            // Se um profissional está selecionado no filtro, só olha para os horários dele
            if (profissionalId && a.profissional_id !== parseInt(profissionalId)) return false;

            // Transforma as strings do banco de volta para Date do JavaScript
            const aInicio = new Date(a.data_hora_inicio);
            const aFim = new Date(a.data_hora_fim);

            // Retorna TRUE se houver sobreposição (overlap) de tempos
            return aInicio < slotFim && aFim > slotInicio;
        });
    };

    const horarioPassado = (hora) => {
        const agora = new Date();
        const dataHora = new Date(`${dataSelecionada}T${hora}:00`);
        return dataHora < agora;
    };

    const handleAgendar = async (hora) => {
        if (!clienteId || !profissionalId || !servicoId) {
            setErro('Selecione cliente, profissional e serviço para agendar.');
            return;
        }

        const servicoSelecionado = servicos.find(s => s.id === parseInt(servicoId));
        const duracao = servicoSelecionado ? servicoSelecionado.duracao_minutos : 30;

        // Formatação exata para TIMESTAMP do PostgreSQL: YYYY-MM-DD HH:mm:ss
        const data_hora_inicio = `${dataSelecionada} ${hora}:00`;
        
        const dataFim = new Date(`${dataSelecionada}T${hora}:00`);
        dataFim.setMinutes(dataFim.getMinutes() + duracao);
        
        // Formata data_hora_fim manualmente para evitar saltos de fuso horário (timezone)
        const ano = dataFim.getFullYear();
        const mes = String(dataFim.getMonth() + 1).padStart(2, '0');
        const dia = String(dataFim.getDate()).padStart(2, '0');
        const horasFim = String(dataFim.getHours()).padStart(2, '0');
        const minutosFim = String(dataFim.getMinutes()).padStart(2, '0');
        const data_hora_fim = `${ano}-${mes}-${dia} ${horasFim}:${minutosFim}:00`;

        try {
            await createAgendamento({
                cliente_id: parseInt(clienteId),
                profissional_id: parseInt(profissionalId),
                servico_id: parseInt(servicoId),
                data_hora_inicio,
                data_hora_fim,
                status: 'agendado'
            });

            setErro('');
            carregarDados();
        } catch (e) {
            setErro(e.response?.data?.erro || 'Erro ao criar agendamento');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Cancelar agendamento?')) {
            await deleteAgendamento(id);
            carregarDados();
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Agenda</h2>

            {/* FILTROS E SELEÇÕES */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <label className="form-label">Data</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dataSelecionada}
                        onChange={(e) => setDataSelecionada(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Profissional</label>
                    <select
                        className="form-control"
                        value={profissionalId}
                        onChange={(e) => setProfissionalId(e.target.value)}
                    >
                        <option value="">Todos / Selecione...</option>
                        {profissionais.map(p => (
                            <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Serviço</label>
                    <select
                        className="form-control"
                        value={servicoId}
                        onChange={(e) => setServicoId(e.target.value)}
                    >
                        <option value="">Selecione para agendar...</option>
                        {servicos.map(s => (
                            <option key={s.id} value={s.id}>{s.nome} ({s.duracao_minutos} min)</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Cliente</label>
                    <select
                        className="form-control"
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                    >
                        <option value="">Selecione para agendar...</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                </div>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            {/* GRADE DE HORÁRIOS */}
            <div className="row">
                {horarios.map(hora => {
                    const ocupado = horarioOcupado(hora);
                    const passado = horarioPassado(hora);

                    let classe = 'btn btn-sm w-100 mb-2 ';
                    if (ocupado) classe += 'btn-danger';
                    else if (passado) classe += 'btn-secondary';
                    else classe += 'btn-success';

                    return (
                        <div className="col-md-2 col-4" key={hora}>
                            <button
                                className={classe}
                                disabled={ocupado || passado}
                                onClick={() => handleAgendar(hora)}
                            >
                                {hora}
                            </button>
                            
                            {/* Mostrar quem agendou e qual o serviço */}
                            {agendamentos
                                .filter(a => {
                                    // Filtra pelo profissional visualizado, se houver algum selecionado
                                    if (profissionalId && a.profissional_id !== parseInt(profissionalId)) return false;
                                    
                                    const aInicio = new Date(a.data_hora_inicio);
                                    const slotInicio = new Date(`${dataSelecionada}T${hora}:00`);
                                    
                                    // Compara se o agendamento COMEÇA exatamente nesta hora para renderizar o bloco de informações
                                    return aInicio.getDate() === slotInicio.getDate() &&
                                           aInicio.getHours() === slotInicio.getHours() && 
                                           aInicio.getMinutes() === slotInicio.getMinutes();
                                })
                                .map(a => (
                                    <div key={a.id} className="small text-center border p-1 mb-2 bg-light shadow-sm rounded">
                                        <strong>{a.cliente_nome || 'Cliente não encontrado'}</strong>
                                        <br />
                                        <span className="text-muted" style={{ fontSize: '0.8em' }}>
                                            {a.servico_nome || 'Serviço'}
                                        </span>
                                        <br />
                                        <button
                                            className="btn btn-link btn-sm text-danger p-0 mt-1"
                                            onClick={() => handleDelete(a.id)}
                                        >
                                            cancelar
                                        </button>
                                    </div>
                                ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}