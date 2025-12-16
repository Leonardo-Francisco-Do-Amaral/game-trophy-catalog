-- Criação da tabela principal de jogos
CREATE TABLE IF NOT EXISTS jogos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    foto_url TEXT,
    desenvolvedora VARCHAR(255),
    publicadora VARCHAR(255),
    ano_lancamento INTEGER,
    genero VARCHAR(100),
    tempo_jogado_horas INTEGER DEFAULT 0,
    tempo_jogado_minutos INTEGER DEFAULT 0,
    nota_gameplay DECIMAL(4, 1), -- Ex: 9.5
    nota_historia DECIMAL(4, 1),
    nota_trilha_sonora DECIMAL(4, 1),
    nota_total DECIMAL(4, 1),
    platinado BOOLEAN DEFAULT FALSE,
    tipo_jogo VARCHAR(50) -- Ex: 'Campanha', 'Multiplayer'
);

-- Criação da tabela de configurações e estatísticas do usuário para cada jogo
CREATE TABLE IF NOT EXISTS configuracoes_usuario_jogo (
    id SERIAL PRIMARY KEY,
    jogo_id INTEGER REFERENCES jogos(id) ON DELETE CASCADE,
    colocacao INTEGER, -- Para ordenação personalizada
    idioma VARCHAR(50),
    plataforma VARCHAR(50), -- Ex: 'PS4', 'PS5', 'Steam'
    status_online VARCHAR(50), -- Ex: 'Servidores Fechados', 'Ativo'
    trofeus_totais INTEGER DEFAULT 0,
    trofeus_obtidos INTEGER DEFAULT 0,
    trofeus_restantes INTEGER DEFAULT 0,
    trofeu_mais_dificil_percentual DECIMAL(5, 2), -- Ex: 0.1%
    completude_jogo VARCHAR(100),
    dificuldade_platina VARCHAR(50), -- Ex: '3/10'
    data_primeiro_trofeu DATE,
    data_ultimo_trofeu DATE,
    dias_para_platina INTEGER
);
