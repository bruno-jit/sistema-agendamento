CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('admin', 'funcionario')) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE profissionais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE
);
CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    duracao_minutos INTEGER NOT NULL
);
CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    
    cliente_id INTEGER NOT NULL,
    profissional_id INTEGER NOT NULL,
    servico_id INTEGER NOT NULL,

    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NOT NULL,

    status VARCHAR(20) CHECK (status IN ('agendado', 'concluido', 'cancelado')) DEFAULT 'agendado',

    observacoes TEXT,

    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_profissional
        FOREIGN KEY (profissional_id)
        REFERENCES profissionais(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_servico
        FOREIGN KEY (servico_id)
        REFERENCES servicos(id)
        ON DELETE CASCADE
);
CREATE INDEX idx_agendamento_profissional 
ON agendamentos (profissional_id);

CREATE INDEX idx_agendamento_data 
ON agendamentos (data_hora_inicio);