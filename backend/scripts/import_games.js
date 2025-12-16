const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Pool } = require('pg');
const https = require('https');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

const RAWG_API_KEY = '656d689bf531403b95aa1d95d29de23e';

// Data provided by the user
const gamesData = [
    {
        nome: "Horizon Chase Turbo",
        desenvolvedora: "Aquiris Game Studio",
        publicadora: "Aquiris Game Studio",
        ano_lancamento: 2018,
        genero: "Corrida - Arcade",
        tempo_jogado_horas: 48,
        tempo_jogado_minutos: 45,
        nota_gameplay: 9,
        nota_historia: 5,
        nota_trilha_sonora: 10,
        nota_total: 24,
        platinado: true,
        colocacao: 16,
        idioma: "legendado",
        trofeus_totais: 49,
        trofeus_obtidos: 49,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 6.43,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - Com DLC",
        dificuldade_platina: "Media",
        data_primeiro_trofeu: "5/23/2018",
        data_ultimo_trofeu: "2/27/2022",
        tipo_midia: "FÍSICA"
    },
    {
        nome: "God of War",
        desenvolvedora: "Santa Monica Studio",
        publicadora: "Sony Interactive Entertainment",
        ano_lancamento: 2018,
        genero: "Aventura - RPG",
        tempo_jogado_horas: 1,
        tempo_jogado_minutos: 57,
        nota_gameplay: 10,
        nota_historia: 10,
        nota_trilha_sonora: 9,
        nota_total: 29,
        platinado: true,
        colocacao: 17,
        idioma: "Dublado",
        trofeus_totais: 37,
        trofeus_obtidos: 37,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 26.55,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "Media",
        data_primeiro_trofeu: "7/10/2018",
        data_ultimo_trofeu: "11/6/2018",
        tipo_midia: "Digital"
    },
    {
        nome: "DOOM",
        desenvolvedora: "ID Software",
        publicadora: "Bethesda Game Studio",
        ano_lancamento: 2016,
        genero: "FPS - Ação - Arcade - Tiro",
        tempo_jogado_horas: 46,
        tempo_jogado_minutos: 42,
        nota_gameplay: 9,
        nota_historia: 5,
        nota_trilha_sonora: 10,
        nota_total: 24,
        platinado: true,
        colocacao: 18,
        idioma: "Dublado",
        trofeus_totais: 55,
        trofeus_obtidos: 36,
        trofeus_restantes: 19,
        trofeu_mais_dificil_percentual: 9.68,
        status_online: "Hibrido",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "Difícil",
        data_primeiro_trofeu: "1/16/2017",
        data_ultimo_trofeu: "1/31/2017",
        tipo_midia: "FÍSICA"
    },
    {
        nome: "Inscryption",
        desenvolvedora: "Daniel Mullins Games",
        publicadora: "Devolver Digital - Daniel Mullins Games",
        ano_lancamento: 2022,
        genero: "Aventura - Cartas e jogos de mesa - Estratégia - Roguelike",
        tempo_jogado_horas: 76,
        tempo_jogado_minutos: 50,
        nota_gameplay: 10,
        nota_historia: 10,
        nota_trilha_sonora: 8,
        nota_total: 28,
        platinado: true,
        colocacao: 19,
        idioma: "legendado",
        trofeus_totais: 41,
        trofeus_obtidos: 41,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 10.3,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "Difícil",
        data_primeiro_trofeu: "9/22/2022",
        data_ultimo_trofeu: "10/16/2022",
        tipo_midia: "Digital"
    },
    {
        nome: "Captain Tsubasa: Rise of New Champions",
        desenvolvedora: "Tamsoft",
        publicadora: "Bandai Namco Entertainment",
        ano_lancamento: 2020,
        genero: "Arcade - Esporte",
        tempo_jogado_horas: 124,
        tempo_jogado_minutos: 30,
        nota_gameplay: 9,
        nota_historia: 8,
        nota_trilha_sonora: 10,
        nota_total: 27,
        platinado: true,
        colocacao: 20,
        idioma: "legendado",
        trofeus_totais: 50,
        trofeus_obtidos: 50,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 7.29,
        status_online: "",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "media",
        data_primeiro_trofeu: "9/9/2021",
        data_ultimo_trofeu: "9/27/2021",
        tipo_midia: "FÍSICA"
    },
    {
        nome: "Yakuza: Like A Dragon",
        desenvolvedora: "Ryu ga Gotoku Studios",
        publicadora: "Sega",
        ano_lancamento: 2020,
        genero: "Baseado em turnos - RPG",
        tempo_jogado_horas: 139,
        tempo_jogado_minutos: 40,
        nota_gameplay: 10,
        nota_historia: 10,
        nota_trilha_sonora: 9,
        nota_total: 29,
        platinado: true,
        colocacao: 22,
        idioma: "legendado",
        trofeus_totais: 63,
        trofeus_obtidos: 63,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 10.46,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "Difícil",
        data_primeiro_trofeu: "4/25/2022",
        data_ultimo_trofeu: "6/25/2022",
        tipo_midia: "FÍSICA"
    },
    {
        nome: "Nioh 2",
        desenvolvedora: "Team Ninja",
        publicadora: "Sony Interactive Entertainment - Koei Tecmo Games",
        ano_lancamento: 2020,
        genero: "RPG",
        tempo_jogado_horas: 203,
        tempo_jogado_minutos: 35,
        nota_gameplay: 10,
        nota_historia: 8,
        nota_trilha_sonora: 9,
        nota_total: 27,
        platinado: true,
        colocacao: 23,
        idioma: "Dublado",
        trofeus_totais: 95,
        trofeus_obtidos: 95,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 14.26,
        status_online: "Hibrido",
        completude_jogo: "platinado - Com DLC",
        dificuldade_platina: "Media",
        data_primeiro_trofeu: "2/26/2021",
        data_ultimo_trofeu: "4/4/2021",
        tipo_midia: "FÍSICA"
    },
    {
        nome: "Marvel's Spider-Man",
        desenvolvedora: "Insomniac Games",
        publicadora: "Sony Interactive Entertainment",
        ano_lancamento: 2018,
        genero: "Aventura",
        tempo_jogado_horas: 61,
        tempo_jogado_minutos: 38,
        nota_gameplay: 10,
        nota_historia: 10,
        nota_trilha_sonora: 9,
        nota_total: 29,
        platinado: true,
        colocacao: 24,
        idioma: "Dublado",
        trofeus_totais: 74,
        trofeus_obtidos: 74,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 30.28,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - Com DLC",
        dificuldade_platina: "Media",
        data_primeiro_trofeu: "3/12/2020",
        data_ultimo_trofeu: "3/31/2020",
        tipo_midia: "Digital"
    },
    {
        nome: "Batman: Arkham Knight",
        desenvolvedora: "Rocksteady Studios",
        publicadora: "WB Games",
        ano_lancamento: 2015,
        genero: "Ação - Aventura",
        tempo_jogado_horas: 111,
        tempo_jogado_minutos: 29,
        nota_gameplay: 9,
        nota_historia: 8,
        nota_trilha_sonora: 8,
        nota_total: 25,
        platinado: true,
        colocacao: 25,
        idioma: "Dublado",
        trofeus_totais: 110,
        trofeus_obtidos: 103,
        trofeus_restantes: 7,
        trofeu_mais_dificil_percentual: 6.55,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - Sem DLC",
        dificuldade_platina: "Facil",
        data_primeiro_trofeu: "9/27/2017",
        data_ultimo_trofeu: "12/12/2017",
        tipo_midia: "Digital"
    },
    {
        nome: "Dragon Ball FighterZ",
        desenvolvedora: "Arc System Works",
        publicadora: "Bandai Namco Entertainment",
        ano_lancamento: 2018,
        genero: "Ação - Luta",
        tempo_jogado_horas: 136,
        tempo_jogado_minutos: 20,
        nota_gameplay: 10,
        nota_historia: 5,
        nota_trilha_sonora: 9,
        nota_total: 24,
        platinado: true,
        colocacao: 26,
        idioma: "legendado",
        trofeus_totais: 36,
        trofeus_obtidos: 36,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 2.81,
        status_online: "Hibrido",
        completude_jogo: "platinado - Sem DLC",
        dificuldade_platina: "Extremamente difícil",
        data_primeiro_trofeu: "2/8/2018",
        data_ultimo_trofeu: "3/5/2023",
        tipo_midia: "FÍSICA"
    },
    {
        nome: "Sonic Forces",
        desenvolvedora: "Sonic Team",
        publicadora: "Sega",
        ano_lancamento: 2017,
        genero: "Aventura - Plataforma - Estrategia",
        tempo_jogado_horas: 34,
        tempo_jogado_minutos: 58,
        nota_gameplay: 8,
        nota_historia: 7,
        nota_trilha_sonora: 10,
        nota_total: 25,
        platinado: true,
        colocacao: 27,
        idioma: "Ingles",
        trofeus_totais: 49,
        trofeus_obtidos: 49,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 24.36,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - Com DLC",
        dificuldade_platina: "media",
        data_primeiro_trofeu: "6/7/2017",
        data_ultimo_trofeu: "6/27/2017",
        tipo_midia: "FÍSICA"
    },
    {
        nome: "inFamous Second Son",
        desenvolvedora: "Sucker Punch Productions",
        publicadora: "Sony Interactive Entertainment",
        ano_lancamento: 2018,
        genero: "Ação - Aventura - tiro",
        tempo_jogado_horas: 30,
        tempo_jogado_minutos: 0,
        nota_gameplay: 10,
        nota_historia: 9,
        nota_trilha_sonora: 8,
        nota_total: 27,
        platinado: true,
        colocacao: 28,
        idioma: "Dublado",
        trofeus_totais: 48,
        trofeus_obtidos: 48,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 25.88,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "media",
        data_primeiro_trofeu: "4/6/2017",
        data_ultimo_trofeu: "7/8/2017",
        tipo_midia: "PS-PLUS"
    },
    {
        nome: "Assassin's Creed Revelations",
        desenvolvedora: "Ubisoft",
        publicadora: "Ubisoft Entertainment",
        ano_lancamento: 2016,
        genero: "Aventura",
        tempo_jogado_horas: 70,
        tempo_jogado_minutos: 12,
        nota_gameplay: 9,
        nota_historia: 8,
        nota_trilha_sonora: 9,
        nota_total: 26,
        platinado: true,
        colocacao: 29,
        idioma: "legendado",
        trofeus_totais: 50,
        trofeus_obtidos: 50,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 29.22,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "Difícil",
        data_primeiro_trofeu: "3/19/2018",
        data_ultimo_trofeu: "4/19/2018",
        tipo_midia: "FÍSICA"
    },
    {
        nome: "Dragon Ball Z: Kakarot (PS4)",
        desenvolvedora: "CyberConnect2",
        publicadora: "Bandai Namco Entertainment",
        ano_lancamento: 2020,
        genero: "RPG",
        tempo_jogado_horas: 72,
        tempo_jogado_minutos: 11,
        nota_gameplay: 10,
        nota_historia: 7,
        nota_trilha_sonora: 10,
        nota_total: 27,
        platinado: true,
        colocacao: 30,
        idioma: "legendado",
        trofeus_totais: 42,
        trofeus_obtidos: 42,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 28.58,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "Facil",
        data_primeiro_trofeu: "6/1/2020",
        data_ultimo_trofeu: "6/23/2020",
        tipo_midia: "Digital"
    },
    {
        nome: "J-Stars Victory VS+",
        desenvolvedora: "Spike ChunSoft",
        publicadora: "Bandai Namco Entertainment",
        ano_lancamento: 2014,
        genero: "Luta",
        tempo_jogado_horas: 69,
        tempo_jogado_minutos: 32,
        nota_gameplay: 9,
        nota_historia: 5,
        nota_trilha_sonora: 8,
        nota_total: 22,
        platinado: true,
        colocacao: 31,
        idioma: "legendado",
        trofeus_totais: 50,
        trofeus_obtidos: 50,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 4.92,
        status_online: "Hibrido",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "Media",
        data_primeiro_trofeu: "6/7/2017",
        data_ultimo_trofeu: "11/6/2017",
        tipo_midia: "FÍSICA"
    },
    {
        nome: "Code Vein",
        desenvolvedora: "Bandai Namco Entertainment - Shift",
        publicadora: "Bandai Namco Entertainment",
        ano_lancamento: 2019,
        genero: "Aventura - RPG",
        tempo_jogado_horas: 101,
        tempo_jogado_minutos: 27,
        nota_gameplay: 9,
        nota_historia: 8,
        nota_trilha_sonora: 10,
        nota_total: 27,
        platinado: true,
        colocacao: 33,
        idioma: "legendado",
        trofeus_totais: 43,
        trofeus_obtidos: 43,
        trofeus_restantes: 0,
        trofeu_mais_dificil_percentual: 9.2,
        status_online: "exclusivamente offline",
        completude_jogo: "platinado - não possui DLC",
        dificuldade_platina: "Difícil",
        data_primeiro_trofeu: "11/6/2019",
        data_ultimo_trofeu: "4/16/2020",
        tipo_midia: "FÍSICA"
    }
];

// Translation map for genres
const genreMap = {
    "Corrida": "Racing",
    "Aventura": "Adventure",
    "RPG": "RPG",
    "Ação": "Action",
    "Tiro": "Shooter",
    "Estratégia": "Strategy",
    "Esporte": "Sports",
    "Luta": "Fighting",
    "Plataforma": "Platformer",
    "Cartas e jogos de mesa": "Card & Board Game",
    "Baseado em turnos": "Turn-based",
    "Arcade": "Arcade",
    "FPS": "FPS",
    "Roguelike": "Roguelike"
};

function translateGenres(genreString) {
    if (!genreString) return "";
    let translated = genreString;
    for (const [pt, en] of Object.entries(genreMap)) {
        const regex = new RegExp(pt, 'gi');
        translated = translated.replace(regex, en);
    }
    return translated;
}

function formatDate(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('/');
    if (parts.length === 3) {
        // Input is MM/DD/YYYY, Output should be YYYY-MM-DD
        return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }
    return null;
}

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
    });
}

async function fetchImage(gameName) {
    try {
        const url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameName)}&page_size=1`;
        const data = await makeRequest(url);
        if (data.results && data.results.length > 0) {
            return data.results[0].background_image;
        }
    } catch (error) {
        console.error(`Erro ao buscar imagem para ${gameName}:`, error.message);
    }
    return null;
}

async function importGames() {
    const client = await pool.connect();
    try {
        console.log('🚀 Iniciando importação...');

        for (const game of gamesData) {
            console.log(`\nProcessando: ${game.nome}`);

            // 1. Translate Genre
            const translatedGenre = translateGenres(game.genero);

            // 2. Format Dates
            const dateFirst = formatDate(game.data_primeiro_trofeu);
            const dateLast = formatDate(game.data_ultimo_trofeu);

            // 3. Fetch Image
            const imageUrl = await fetchImage(game.nome);
            console.log(`   Imagem: ${imageUrl ? 'Encontrada' : 'Não encontrada'}`);

            await client.query('BEGIN');

            const jogoQuery = `
                INSERT INTO jogos (
                    nome, foto_url, desenvolvedora, publicadora, ano_lancamento, genero,
                    tempo_jogado_horas, tempo_jogado_minutos, nota_gameplay, nota_historia,
                    nota_trilha_sonora, nota_total, platinado, tipo_jogo
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                RETURNING id;
            `;

            // Assuming 'tipo_jogo' maps to 'Campanha' as default since not specified, 
            // or maybe we can map 'online' status to it if relevant. 
            // For now, let's use 'Campanha' as a safe default for these types of games.
            const tipoJogo = "Campanha";

            const jogoValues = [
                game.nome, imageUrl, game.desenvolvedora, game.publicadora, game.ano_lancamento, translatedGenre,
                game.tempo_jogado_horas, game.tempo_jogado_minutos, game.nota_gameplay, game.nota_historia,
                game.nota_trilha_sonora, game.nota_total, game.platinado, tipoJogo
            ];

            const res = await client.query(jogoQuery, jogoValues);
            const gameId = res.rows[0].id;

            const configQuery = `
                INSERT INTO configuracoes_usuario_jogo (
                    jogo_id, colocacao, idioma, plataforma, status_online, trofeus_totais,
                    trofeus_obtidos, trofeus_restantes, trofeu_mais_dificil_percentual,
                    completude_jogo, dificuldade_platina, data_primeiro_trofeu,
                    data_ultimo_trofeu, dias_para_platina, tipo_midia
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
            `;

            // Infer Platform if possible, or default to 'PS4' given the context of trophies
            const plataforma = "PS4";

            // Calculate days for platinum if possible
            let diasParaPlatina = 0;
            if (dateFirst && dateLast) {
                const d1 = new Date(dateFirst);
                const d2 = new Date(dateLast);
                const diffTime = Math.abs(d2 - d1);
                diasParaPlatina = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            const configValues = [
                gameId, game.colocacao, game.idioma, plataforma, game.status_online, game.trofeus_totais,
                game.trofeus_obtidos, game.trofeus_restantes, game.trofeu_mais_dificil_percentual,
                game.completude_jogo, game.dificuldade_platina, dateFirst,
                dateLast, diasParaPlatina, game.tipo_midia
            ];

            await client.query(configQuery, configValues);
            await client.query('COMMIT');
            console.log(`   ✅ ${game.nome} importado com sucesso!`);
        }

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Erro na importação:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

importGames();
