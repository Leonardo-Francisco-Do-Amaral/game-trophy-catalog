require('dotenv').config(); // Carrega as variáveis de ambiente do .env

const express = require('express');
const { Pool } = require('pg'); // Importa o Pool do pg para conexão com o banco
const cors = require('cors'); // Importa o CORS

const app = express();
const port = process.env.PORT || 3001; // Porta do servidor

// Configuração do banco de dados
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração da API RAWG
const RAWG_API_KEY = '656d689bf531403b95aa1d95d29de23e';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// Função para fazer requisições HTTP (alternativa ao node-fetch)
const https = require('https');
const http = require('http');

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https:') ? https : http;
        
        const req = protocol.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (error) {
                    reject(new Error(`Erro ao parsear JSON: ${error.message}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Timeout na requisição'));
        });
    });
}

// Função para remover acentos e caracteres especiais
function normalizarNome(nome) {
    return nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-zA-Z0-9 ]/g, '') // Remove caracteres especiais
        .trim();
}

// Função para buscar imagem na RAWG, tentando variações do nome
async function buscarImagemRAWG(nomeJogo) {
    const tentativas = [
        nomeJogo, // Nome original
        normalizarNome(nomeJogo), // Nome normalizado
        normalizarNome(nomeJogo).replace(/ /g, ''), // Nome sem espaços
        nomeJogo.split(' ')[0], // Primeira palavra apenas
        nomeJogo.split(':')[0].trim(), // Parte antes dos dois pontos (para jogos com subtítulos)
    ];
    
    console.log(`🎮 Buscando imagem para: "${nomeJogo}"`);
    
    for (let i = 0; i < tentativas.length; i++) {
        const nomeTentativa = tentativas[i];
        if (!nomeTentativa || nomeTentativa.length < 2) continue;
        
        try {
            const url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(nomeTentativa)}&page_size=3`;
            console.log(`   Tentativa ${i + 1}: "${nomeTentativa}"`);
            
            const data = await makeRequest(url);
            
            if (data.results && data.results.length > 0) {
                // Procura por uma correspondência exata ou similar
                for (const game of data.results) {
                    if (game.background_image) {
                        const nomeEncontrado = game.name.toLowerCase();
                        const nomeBuscado = nomeJogo.toLowerCase();
                        
                        // Verifica se há correspondência (exata ou parcial)
                        if (nomeEncontrado.includes(nomeBuscado.split(' ')[0]) || 
                            nomeBuscado.includes(nomeEncontrado.split(' ')[0])) {
                            console.log(`   ✅ Imagem encontrada: ${game.name}`);
                            return game.background_image;
                        }
                    }
                }
                
                // Se não encontrou correspondência exata, usa o primeiro resultado
                if (data.results[0].background_image) {
                    console.log(`   ⚠️  Usando primeiro resultado: ${data.results[0].name}`);
                    return data.results[0].background_image;
                }
            }
            
            // Pequena pausa entre requisições para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.log(`   ❌ Erro na tentativa ${i + 1}: ${error.message}`);
            continue;
        }
    }
    
    console.log(`   ❌ Nenhuma imagem encontrada para "${nomeJogo}"`);
    return null;
}

// Rota para testar a API RAWG
app.get('/api/test-rawg/:gameName', async (req, res) => {
    const { gameName } = req.params;
    
    try {
        console.log(`\n🔍 Testando busca por: "${gameName}"`);
        const imagem = await buscarImagemRAWG(gameName);
        
        if (imagem) {
            res.json({ 
                success: true, 
                game: gameName,
                image: imagem,
                message: 'Imagem encontrada com sucesso!' 
            });
        } else {
            res.json({ 
                success: false, 
                game: gameName,
                image: null,
                message: 'Nenhuma imagem encontrada' 
            });
        }
    } catch (error) {
        console.error('Erro no teste da RAWG:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Rota para buscar os dados combinados de jogos e configurações do usuário
app.get('/api/jogos', async (req, res) => {
    try {
        console.log('\n📊 Buscando jogos no banco de dados...');
        
        // Realiza um LEFT JOIN entre as tabelas 'jogos' e 'configuracoes_usuario_jogo'
        const query = `
            SELECT
                j.id,
                j.nome,
                j.foto_url,
                j.desenvolvedora,
                j.publicadora,
                j.ano_lancamento,
                j.genero,
                j.tempo_jogado_horas,
                j.tempo_jogado_minutos,
                j.nota_gameplay,
                j.nota_historia,
                j.nota_trilha_sonora,
                j.nota_total,
                j.platinado,
                j.tipo_jogo,
                cuj.colocacao,
                cuj.idioma,
                cuj.plataforma,
                cuj.status_online,
                cuj.trofeus_totais,
                cuj.trofeus_obtidos,
                cuj.trofeus_restantes,
                cuj.trofeu_mais_dificil_percentual,
                cuj.completude_jogo,
                cuj.dificuldade_platina,
                cuj.data_primeiro_trofeu,
                cuj.data_ultimo_trofeu,
                cuj.dias_para_platina
            FROM
                jogos AS j
            LEFT JOIN
                configuracoes_usuario_jogo AS cuj ON j.id = cuj.jogo_id
            ORDER BY
                cuj.colocacao ASC NULLS LAST, j.id

        `;
        
        const result = await pool.query(query);
        const jogos = result.rows;
        console.log(`📋 Encontrados ${jogos.length} jogos no banco`);
        res.json(jogos);
        
    } catch (err) {
        console.error('❌ Erro ao buscar jogos:', err);
        res.status(500).json({ 
            error: 'Erro interno do servidor ao buscar jogos.',
            details: err.message 
        });
    }
});

app.get('/api/jogos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`\n🔎 Buscando jogo com ID: ${id}`);
        const query = `
            SELECT
                j.id, j.nome, j.foto_url, j.desenvolvedora, j.publicadora, j.ano_lancamento, j.genero,
                j.tempo_jogado_horas, j.tempo_jogado_minutos, j.nota_gameplay, j.nota_historia,
                j.nota_trilha_sonora, j.nota_total, j.platinado, j.tipo_jogo,
                cuj.colocacao, cuj.idioma, cuj.plataforma, cuj.status_online, cuj.trofeus_totais,
                cuj.trofeus_obtidos, cuj.trofeus_restantes, cuj.trofeu_mais_dificil_percentual,
                cuj.completude_jogo, cuj.dificuldade_platina, cuj.data_primeiro_trofeu,
                cuj.data_ultimo_trofeu, cuj.dias_para_platina
            FROM jogos AS j
            LEFT JOIN configuracoes_usuario_jogo AS cuj ON j.id = cuj.jogo_id
            WHERE j.id = $1;
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Jogo não encontrado.' });
        }

        console.log(`✅ Jogo "${result.rows[0].nome}" encontrado.`);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('❌ Erro ao buscar jogo por ID:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Rota para CADASTRAR um novo jogo (POST)
app.post('/api/jogos', async (req, res) => {
    // A mágica acontece aqui com uma transação
    const client = await pool.connect(); // Pega uma conexão do pool

    try {
        // 1. Inicia a transação
        await client.query('BEGIN');

        // 2. Destrutura todos os dados recebidos do formulário
        const {
            nome, foto_url, desenvolvedora, publicadora, ano_lancamento, genero,
            tempo_jogado_horas, tempo_jogado_minutos, nota_gameplay, nota_historia,
            nota_trilha_sonora, nota_total, platinado, tipo_jogo, colocacao, idioma,
            plataforma, status_online, trofeus_totais, trofeus_obtidos, trofeus_restantes,
            trofeu_mais_dificil_percentual, completude_jogo, dificuldade_platina,
            data_primeiro_trofeu, data_ultimo_trofeu, dias_para_platina
        } = req.body;

        // 3. Primeiro INSERT: na tabela principal 'jogos'
        //    Usamos 'RETURNING id' para obter o ID do jogo recém-criado.
        const jogoQuery = `
            INSERT INTO jogos (
                nome, foto_url, desenvolvedora, publicadora, ano_lancamento, genero, 
                tempo_jogado_horas, tempo_jogado_minutos, nota_gameplay, nota_historia,
                nota_trilha_sonora, nota_total, platinado, tipo_jogo
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id;
        `;
        const jogoValues = [
            nome, foto_url, desenvolvedora, publicadora, ano_lancamento, genero,
            tempo_jogado_horas, tempo_jogado_minutos, nota_gameplay, nota_historia,
            nota_trilha_sonora, nota_total, platinado, tipo_jogo
        ];

        const novoJogoResult = await client.query(jogoQuery, jogoValues);
        const novoJogoId = novoJogoResult.rows[0].id; // Captura o ID retornado

        if (!novoJogoId) {
            throw new Error('Falha ao criar o registro do jogo principal.');
        }

        // 4. Segundo INSERT: na tabela de configurações do usuário
        //    Usamos o 'novoJogoId' para criar a relação entre as tabelas.
        const configQuery = `
            INSERT INTO configuracoes_usuario_jogo (
                jogo_id, colocacao, idioma, plataforma, status_online, trofeus_totais,
                trofeus_obtidos, trofeus_restantes, trofeu_mais_dificil_percentual,
                completude_jogo, dificuldade_platina, data_primeiro_trofeu,
                data_ultimo_trofeu, dias_para_platina
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
        `;
        const configValues = [
            novoJogoId, colocacao, idioma, plataforma, status_online, trofeus_totais,
            trofeus_obtidos, trofeus_restantes, trofeu_mais_dificil_percentual,
            completude_jogo, dificuldade_platina, data_primeiro_trofeu || null, // Garante que datas vazias virem NULL
            data_ultimo_trofeu || null, dias_para_platina
        ];

        await client.query(configQuery, configValues);

        // 5. Se tudo deu certo, 'commita' a transação (salva permanentemente)
        await client.query('COMMIT');

        console.log(`✅ Jogo "${nome}" e suas configurações foram salvos com sucesso!`);
        res.status(201).json({ message: 'Jogo cadastrado com sucesso!' });

    } catch (err) {
        // 6. Se algo deu errado, faz o 'rollback' (desfaz todas as operações da transação)
        await client.query('ROLLBACK');

        console.error('❌ Erro na transação ao salvar jogo:', err);
        res.status(500).json({
            error: 'Erro interno do servidor ao salvar o jogo.',
            details: err.message
        });

    } finally {
        // 7. Independentemente do resultado, libera a conexão de volta para o pool
        client.release();
    }
});

app.put('/api/jogos/:id', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            nome, foto_url, desenvolvedora, publicadora, ano_lancamento, genero,
            tempo_jogado_horas, tempo_jogado_minutos, nota_gameplay, nota_historia,
            nota_trilha_sonora, nota_total, platinado, tipo_jogo, colocacao, idioma,
            plataforma, status_online, trofeus_totais, trofeus_obtidos, trofeus_restantes,
            trofeu_mais_dificil_percentual, completude_jogo, dificuldade_platina,
            data_primeiro_trofeu, data_ultimo_trofeu, dias_para_platina
        } = req.body;

        // 1. UPDATE na tabela 'jogos'
        const jogoQuery = `
            UPDATE jogos SET
                nome = $1, foto_url = $2, desenvolvedora = $3, publicadora = $4, ano_lancamento = $5,
                genero = $6, tempo_jogado_horas = $7, tempo_jogado_minutos = $8, nota_gameplay = $9,
                nota_historia = $10, nota_trilha_sonora = $11, nota_total = $12, platinado = $13, tipo_jogo = $14
            WHERE id = $15;
        `;
        const jogoValues = [
            nome, foto_url, desenvolvedora, publicadora, ano_lancamento, genero,
            tempo_jogado_horas, tempo_jogado_minutos, nota_gameplay, nota_historia,
            nota_trilha_sonora, nota_total, platinado, tipo_jogo, id
        ];
        await client.query(jogoQuery, jogoValues);

        // 2. UPDATE na tabela 'configuracoes_usuario_jogo'
        const configQuery = `
            UPDATE configuracoes_usuario_jogo SET
                colocacao = $1, idioma = $2, plataforma = $3, status_online = $4, trofeus_totais = $5,
                trofeus_obtidos = $6, trofeus_restantes = $7, trofeu_mais_dificil_percentual = $8,
                completude_jogo = $9, dificuldade_platina = $10, data_primeiro_trofeu = $11,
                data_ultimo_trofeu = $12, dias_para_platina = $13
            WHERE jogo_id = $14;
        `;
        const configValues = [
            colocacao, idioma, plataforma, status_online, trofeus_totais,
            trofeus_obtidos, trofeus_restantes, trofeu_mais_dificil_percentual,
            completude_jogo, dificuldade_platina, data_primeiro_trofeu || null,
            data_ultimo_trofeu || null, dias_para_platina, id
        ];
        await client.query(configQuery, configValues);

        await client.query('COMMIT');
        console.log(`✅ Jogo com ID ${id} atualizado com sucesso!`);
        res.status(200).json({ message: 'Jogo atualizado com sucesso!' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Erro na transação ao atualizar jogo com ID ${id}:`, err);
        res.status(500).json({ error: 'Erro interno ao atualizar o jogo.', details: err.message });
    } finally {
        client.release();
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    
    // Testa a conexão com o banco de dados ao iniciar
    pool.query('SELECT NOW()')
        .then(() => console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso!'))
        .catch(err => console.error('❌ Erro ao conectar ao PostgreSQL:', err.message));
});