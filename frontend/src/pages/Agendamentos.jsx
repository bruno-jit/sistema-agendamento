import { useEffect, useState } from 'react';
import {
    getAgendamentos,
    createAgendamento,
    deleteAgendamento
} from '../services/agendamentoService';
import { getClientes } from '../services/clienteService';

const HORARIO_INICIO = 8;
const HORARIO_FIM = 18;
const INTERVALO_MINUTOS = 30;

export default function Agendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [erro, setErro] = useState('');

    const carregarDados = async () => {
        const [ags, cls] = await Promise.all([
            getAgendamentos(),
            getClientes()
        ]);

        setAgendamentos(ags.data);
        setClientes(cls.data);
    };

    useEffect(() => {
        carregarDados();
    }, []);

    // 🔥 gerar horários do dia
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
        return agendamentos.some(a => a.data === dataSelecionada && a.hora === hora);
    };

    const horarioPassado = (hora) => {
        const agora = new Date();
        const dataHora = new Date(`${dataSelecionada}T${hora}`);
        return dataHora < agora;
    };

    const handleAgendar = async (hora) => {
        if (!clienteId) {
            setErro('Selecione um cliente');
            return;
        }

        if (horarioOcupado(hora)) {
            setErro('Horário já ocupado');
            return;
        }

        if (horarioPassado(hora)) {
            setErro('Não pode agendar no passado');
            return;
        }
        await createAgendamento({
            cliente_id: clienteId,
            data: dataSelecionada,
            hora
        });

        setErro('');
        carregarDados();
    };

    const handleDelete = async (id) => {
        if (confirm('Cancelar agendamento?')) {
            await deleteAgendamento(id);
            carregarDados();
        }
    };

    return (
        <div>
            <h2 className="mb-4">Agenda</h2>

            {/* FILTROS */}
            <div className="row mb-4">
                <div className="col">
                    <input
                        type="date"
                        className="form-control"
                        value={dataSelecionada}
                        onChange={(e) => setDataSelecionada(e.target.value)}
                    />
                </div>
                <div className="col">
                    <select
                        className="form-control"
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                    >
                        <option value="">Selecione cliente</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            {/* CALENDÁRIO */}
            <div className="row">
                {horarios.map(hora => {
                    const ocupado = horarioOcupado(hora);
                    const passado = horarioPassado(hora);

                    let classe = 'btn btn-sm w-100 mb-2 ';

                    if (ocupado) classe += 'btn-danger';
                    else if (passado) classe += 'btn-secondary';
                    else classe += 'btn-success';

                    return (
                        <div className="col-3" key={hora}>
                            <button
                                className={classe}
                                disabled={ocupado || passado}
                                onClick={() => handleAgendar(hora)}
                            >
                                {hora}
                            </button>
                            {/* Mostrar quem agendou */}
                            {agendamentos
                                .filter(a => a.data === dataSelecionada && a.hora === hora)
                                .map(a => (
                                    <div key={a.id} className="small text-center">
                                        {a.cliente_nome}
                                        <br />
                                        <button
                                            className="btn btn-link btn-sm text-danger"
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