const { Pool } = require('pg');
const https = require('https');
const path = require('path');

// Config via .env should be loaded by running with `node -r dotenv/config` or I can require it here if file is local
// Trying to load from backend/.env (assuming script is in backend/scripts)
try {
    require('dotenv').config({ path: path.join(__dirname, '../.env') });
    // If that fails or variables missing, try default
    if (!process.env.DB_USER) require('dotenv').config();
} catch (e) {
    try { require('dotenv').config(); } catch (e2) { }
}

console.log(`Debug ENV: User=${process.env.DB_USER}, Host=${process.env.DB_HOST}`);

// Configuração da API RAWG (copied from server.js)
const RAWG_API_KEY = '656d689bf531403b95aa1d95d29de23e';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

// RAW Data provided by user
const RAW_DATA = `34	The Sims 4	Electronic Arts - The Sims Studio 	Electronic Arts	legendado	2017	Strategy - Simulation	59	52	8	8	5	7,0	Não	51	21	30	5,45	exclusivamente offline	Não Platinado	Difícil	1/10/2019	6/22/2019		Digital	DesafioEscolta,DesafioAcumuloDinheiro,DesafioVariosFinais,Cheats,Customizacao,OpcaoRomance,NarrativaRamificada,Familia
35	Dragon Ball Xenoverse 2	Dimps Corporation	Bandai Namco Entertainment	Dublado	2016	Aventura- Luta - RPG	84	21	9	8	8	8,3	Sim	61	52	9	5,79	Hibrido	platinado - Sem DLC	Media	10/5/2018	10/25/2018		Digital	ProtagonistaMudo,Customizacao,EstiloAnime
36	Assassin's Creed Origins	Ubisoft	Ubisoft Entertainment	Dublado	2017	Ação - Aventura - RPG	80	28	8	8	8	8,0	Sim	68	62	6	23,46	exclusivamente offline	platinado - Sem DLC	media	1/8/2018	2/23/2018		FÍSICA	DesafioSorteRNG,DesafioStealth
37	Minecraft Dungeons	Mojang AB	Mojang Studios - Xbox Game Studios	Dublado	2020	Aventura - RPG	155	50	10	5	7	7,3	Sim	105	87	18	16,89	Hibrido	platinado - Sem DLC	Facil	6/21/2020	5/22/2022		Digital	DesafioLootbox,DesafioSorteRNG,DesafioDatado,DesafioCoOp,DesafioVelocidade,DesafioVariosFinais,DesafioDificuldade,ProtagonistaMudo,Customizacao,Domador
37	GreedFall	Spiders	Focus Home Interactive	legendado	2019	Ação - Aventura - RPG - Estratégia 	102	29	9	10	8	9,0	sim	64	64	0	2,67	exclusivamente offline	platinado - Com DLC	Media	1/4/2023	3/9/2023		PS-PLUS	Customizacao,PartySystem.OpcaoRomance,NarrativaRamificada
38	NIOH	Team Ninja	Sony Interactive Entertainment - Koei Tecmo Games	legendado	2017	RPG - Soulslike	145	25	10	6	8	8,0	Sim	86	78	8	12,14	exclusivamente offline	platinado - Sem DLC	Difícil	12/2/2019	12/12/2020		PS-PLUS	DesafioVariosFinais,DesafioOnlinePVP,DesafioDatado,DesafioVelocidade,DesafioNivelMaximo,Hardcore
39	Ghost of Tsushima	Sucker Punch Productions	Sony Interactive Entertainment	Dublado	2020	Aventura - RPG	113	20	10	10	9	9,7	sim	77	77	0	35,36	Hibrido	platinado - Com DLC	Difícil	6/18/2022	7/28/2022		PS-PLUS	ExclusivoSony,DesafioCoOp,DesafioNivelMaximo,DesafioMultiKill
40	Cult of the Lamb	Massive Monster	Devolver Digital	legendado	2022	Aventura -   Simulador - Roguelike 	43	50	9	8	8	8,3	sim	37	37	0	13,56	exclusivamente offline	platinado - não possui DLC	Media	11/20/2022	12/31/2022		Digital	No Damage,RNGesus,Crafting,ProtagonistaAnimal,Demonios,Domador,OpcaoRomance,NarrativaRamificada,MinigamePesca,DesafioVelocidade
41	Chroma Squad	Behold Studios	Bandai Namco Entertainment - Behold Studios	legendado	2017	Estratégia - Tatico - RPG 	16	10	10	9	7	8,7	Não	44	33	11	2,86	exclusivamente offline	Não Platinado	Difícil	8/28/2018	9/7/2018		Digital	Por Turnos,PartySystem,Brasileiro,Retro,DesafioDificuldade,DesafioVariosFinais,DesafioElenco
42	Mortal Kombat 11	NetherRealm Studios	WB Games	Dublado	2019	Ação - Luta	110	37	10	5	7	7,3	Sim	59	59	0	6,87	Hibrido	platinado - não possui DLC	Media	1/9/2018	9/1/2018		Digital	DesafioVelocidade,DesafioCoOp,DesafioOnlinePVP,DesafioComboMaster,DesafioElenco
43	Life is Strange	Dontnod Entertainment	Square Enix - Feral Interactive	legendado	2015	 Aventura - RPG	18	5	7	10	8	8,3	Sim	61	61	0	31,5	exclusivamente offline	platinado - não possui DLC	Facil	1/19/2018	1/22/2018		PS-PLUS	ProtagonistaCrianca,ViagemTempo, OpcaoRomance,NarrativaRamificada,DesafioQTE
44	Trials of Mana	Square Enix	Square Enix	Espanhol	2020	Aventura - RPG	61	25	10	9	7	8,7	sim	44	44	0	28,42	exclusivamente offline	platinado - não possui DLC	Media	12/29/2020	5/23/2022		Digital	DesafioElenco,DesafioDificuldade,DesafioVariosFinais,DesafioPerdiveis,DesafioNivelMaximo,DesafioAcumuloDinheiro,ProtagonistaCrianca,ProtagonistaAnimal,PartySystem,RemasterRemake
45	Life is Strange: Before the Storm	Deck Nine	Square Enix	legendado	2017	Aventura	11	49	7	8	7	7,3	Sim	35	35	0	61,65	exclusivamente offline	platinado - não possui DLC	Facil	3/13/2019	5/17/2019		Digital	ProtagonistaCrianca,OpcaoRomance,NarrativaRamificadaDesafioQTE`;

// Helper Functions
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https:') ? https : require('http');
        const req = protocol.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (error) {
                    reject(new Error(`Erro ao parsear JSON: ${error.message}`));
                }
            });
        });
        req.on('error', (error) => { reject(error); });
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Timeout na requisição'));
        });
    });
}

function normalizarNome(nome) {
    return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 ]/g, '').trim();
}

async function buscarImagemRAWG(nomeJogo) {
    // Tenta encontrar imagem (logica simplificada do server.js)
    const tentativas = [
        nomeJogo,
        normalizarNome(nomeJogo),
        nomeJogo.split(':')[0].trim(),
    ];

    for (const nome of tentativas) {
        if (!nome) continue;
        try {
            console.log(`   Procurando imagem para: ${nome}`);
            const url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(nome)}&page_size=1`;
            const data = await makeRequest(url);
            if (data.results && data.results.length > 0) {
                if (data.results[0].background_image) return data.results[0].background_image;
            }
            await new Promise(r => setTimeout(r, 200)); // Delay
        } catch (e) {
            console.log(`   Erro ao buscar imagem para ${nome}: ${e.message}`);
        }
    }
    return null;
}

function mapGenero(generoRaw) {
    if (!generoRaw) return '';
    const map = {
        'Aventura': 'Adventure',
        'Ação': 'Action',
        'Luta': 'Fighting',
        'Estratégia': 'Strategy',
        'Simulação': 'Simulation',
        'Simulador': 'Simulation',
        'Corrida': 'Racing',
        'Esporte': 'Sports',
        'Tatico': 'Strategy', // Mapping Tatico to Strategy roughly, or keep as is?
        'Tático': 'Strategy',
        'Soulslike': 'RPG', // Or keep Soulslike if supported? Let's map to RPG to be safe or append.
    };

    // Split, map, join
    const parts = generoRaw.split(/[\-\/]/).map(g => g.trim());
    const mapped = parts.map(p => map[p] || map[p.charAt(0).toUpperCase() + p.slice(1)] || p);
    // Remove duplicates
    return [...new Set(mapped)].join(' - ');
}

function parseDate(dateStr) {
    if (!dateStr) return null;
    // Format M/D/YYYY
    const [month, day, year] = dateStr.split('/');
    if (!year) return null; // Invalid
    // Return ISO YYYY-MM-DD
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

async function run() {
    const client = await pool.connect();
    try {
        console.log("Iniciando inserção em massa...");

        const lines = RAW_DATA.split('\n');
        for (const line of lines) {
            if (!line.trim()) continue;

            const cols = line.split('\t');
            // Check if splitting worked (tab separated)
            // Layout based on user request:
            // 0: colocação
            // 1: Nome
            // 2: Desenvolvedora
            // 3: publicadora
            // 4: Língua
            // 5: Ano de lançamento
            // 6: gênero/Tema
            // 7: tempo de jogo em horas
            // 8: tempo de jogo em minutos (label says segundos but example is 52)
            // 9: nota gameplay
            // 10: nota historia
            // 11: nota musica
            // 12: nota totla
            // 13: Platinado (Sim/Não)
            // 14: troféus totais
            // 15: troféu obtidos
            // 16: troféus restantes
            // 17: torfeu mais dificil (float)
            // 18: online
            // 19: completude de jogo
            // 20: dificuldade da platina
            // 21: dia do primeiro troféu
            // 22: dia do ultimo troféu
            // 23: (EMPTY - originally placeholder?)
            // 24: tipo midia  (In raw data, sometimes this is index 24. Let's verify by counting)
            // 25: tags

            // Validating indices with Sims 4 line:
            // 34 (0), Sims 4 (1), EA (2), EA (3), leg (4), 2017 (5), Strat (6), 59 (7), 52 (8), 8 (9), 8 (10), 5 (11), 7.0 (12), Nao (13), 51 (14), 21 (15), 30 (16), 5.45 (17), offline (18), Nao Plat (19), Dificil (20), 1/10/19 (21), 6/22/19 (22), EMPTY (23), Digital (24), Tags (25)

            const nome = cols[1]?.trim();
            if (!nome) continue;

            console.log(`Processando: ${nome}`);

            // 1. Fetch Image
            const foto_url = await buscarImagemRAWG(nome) || '';

            // 2. Map Fields
            const desenvolvedora = cols[2]?.trim();
            const publicadora = cols[3]?.trim();
            const ano_lancamento = parseInt(cols[5]) || null;
            const genero = mapGenero(cols[6]?.trim());
            const tempo_jogado_horas = parseInt(cols[7]) || 0;
            const tempo_jogado_minutos = parseInt(cols[8]) || 0;
            const nota_gameplay = parseFloat(cols[9]?.replace(',', '.')) || 0;
            const nota_historia = parseFloat(cols[10]?.replace(',', '.')) || 0;
            const nota_trilha_sonora = parseFloat(cols[11]?.replace(',', '.')) || 0;
            const nota_total = parseFloat(cols[12]?.replace(',', '.')) || 0;
            const platinado = cols[13]?.toLowerCase().includes('sim');

            // Configs
            const colocacao = parseInt(cols[0]) || null;

            // Map Idioma
            let idioma = cols[4]?.toLowerCase() || 'legendado';
            if (idioma.includes('dublado')) idioma = 'dublado';
            else if (idioma.includes('espanhol')) idioma = 'espanhol';
            else idioma = 'legendado';

            // Map Online
            let status_online = cols[18]?.toLowerCase().trim();
            if (status_online.includes('offline')) status_online = 'exclusivamente_offline';
            else if (status_online.includes('online')) status_online = 'exclusivamente_online';
            else if (status_online.includes('hibrido')) status_online = 'Hibrido'; // Case sensitive in DB ENUM check? App uses 'Hibrido'.
            else status_online = 'exclusivamente_offline';

            // Map Completude
            let completude_jogo = cols[19]?.toLowerCase().trim();
            if (completude_jogo.includes('não') || completude_jogo.includes('nao')) completude_jogo = 'nao_platinado';
            else if (completude_jogo.includes('sem dlc')) completude_jogo = 'platinado_sem_dlc';
            else if (completude_jogo.includes('com dlc')) completude_jogo = 'platinado_com_dlc';
            else if (completude_jogo.includes('não possui dlc')) completude_jogo = 'platinado_nao_possui_dlc';
            else completude_jogo = 'nao_platinado';

            // Map Dificuldade
            let dificuldade_platina = cols[20]?.toLowerCase().trim();
            if (dificuldade_platina.includes('facil') || dificuldade_platina.includes('fácil')) dificuldade_platina = 'facil';
            else if (dificuldade_platina.includes('media') || dificuldade_platina.includes('média')) dificuldade_platina = 'medio';
            else if (dificuldade_platina.includes('dificil') || dificuldade_platina.includes('difícil')) dificuldade_platina = 'dificil';
            else dificuldade_platina = 'medio';

            // Type
            let tipo_jogo = cols[24]?.toLowerCase().trim();
            if (!tipo_jogo) {
                // Try col 23 just in case
                if (cols[23]?.trim().length > 2) tipo_jogo = cols[23].toLowerCase().trim();
            }
            if (tipo_jogo.includes('digital')) tipo_jogo = 'digital';
            else if (tipo_jogo.includes('física') || tipo_jogo.includes('fisica')) tipo_jogo = 'fisica';
            else if (tipo_jogo.includes('plus')) tipo_jogo = 'ps_plus';
            else tipo_jogo = 'digital';

            // Dates
            const data_primeiro_trofeu = parseDate(cols[21]?.trim());
            const data_ultimo_trofeu = parseDate(cols[22]?.trim());

            // Calculo dias
            let dias_para_platina = null;
            if (data_primeiro_trofeu && data_ultimo_trofeu) {
                const d1 = new Date(data_primeiro_trofeu);
                const d2 = new Date(data_ultimo_trofeu);
                dias_para_platina = Math.ceil(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
            }

            // Stats
            const trofeus_totais = parseInt(cols[14]) || 0;
            const trofeus_obtidos = parseInt(cols[15]) || 0;
            const trofeus_restantes = parseInt(cols[16]) || 0;
            const trofeu_mais_dificil_percentual = parseFloat(cols[17]?.replace(',', '.')) || 0;

            // Platform - Default to PS4 as user data is missing it
            const plataforma = 'PS4';

            // Tags
            // Try last column
            let tagsRaw = cols[cols.length - 1];
            // If the last column is actually empty (trailing tab), try previous
            if (!tagsRaw || tagsRaw.trim() === '') tagsRaw = cols[cols.length - 2];
            // Split by comma
            let tags = [];
            if (tagsRaw) {
                tags = tagsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);
            }
            const tagsJson = JSON.stringify(tags);

            // DB Operations
            try {
                await client.query('BEGIN');

                const gameQuery = `
                    INSERT INTO jogos (
                        nome, foto_url, desenvolvedora, publicadora, ano_lancamento, genero,
                        tempo_jogado_horas, tempo_jogado_minutos, nota_gameplay, nota_historia,
                        nota_trilha_sonora, nota_total, platinado, tipo_jogo, tags
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                    RETURNING id
                `;
                const gameValues = [
                    nome, foto_url, desenvolvedora, publicadora, ano_lancamento, genero,
                    tempo_jogado_horas, tempo_jogado_minutos, nota_gameplay, nota_historia,
                    nota_trilha_sonora, nota_total, platinado, tipo_jogo, tagsJson
                ];

                const gameRes = await client.query(gameQuery, gameValues);
                const gameId = gameRes.rows[0].id;

                const configQuery = `
                    INSERT INTO configuracoes_usuario_jogo (
                        jogo_id, colocacao, idioma, plataforma, status_online,
                        trofeus_totais, trofeus_obtidos, trofeus_restantes, trofeu_mais_dificil_percentual,
                        completude_jogo, dificuldade_platina, data_primeiro_trofeu, data_ultimo_trofeu,
                        dias_para_platina
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                `;
                const configValues = [
                    gameId, colocacao, idioma, plataforma, status_online,
                    trofeus_totais, trofeus_obtidos, trofeus_restantes, trofeu_mais_dificil_percentual,
                    completude_jogo, dificuldade_platina, data_primeiro_trofeu, data_ultimo_trofeu,
                    dias_para_platina
                ];

                await client.query(configQuery, configValues);
                await client.query('COMMIT');
                console.log(`   ✅ ${nome} inserido com sucesso (ID: ${gameId})`);

            } catch (err) {
                await client.query('ROLLBACK');
                console.error(`   ❌ Erro ao inserir ${nome}: ${err.message}`);
            }
        }

    } catch (err) {
        console.error('Erro geral:', err);
    } finally {
        client.release();
        pool.end();
    }
}

run();
