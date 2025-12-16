const { Pool } = require('pg');
const https = require('https');
const path = require('path');

// Config env
try { require('dotenv').config({ path: path.join(__dirname, '../.env') }); } catch (e) {
    try { require('dotenv').config(); } catch (e2) { }
}

const RAWG_API_KEY = '656d689bf531403b95aa1d95d29de23e';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
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
            reject(new Error('Timeout'));
        });
    });
}

async function getMetacritic(gameName) {
    try {
        // Search for game
        const searchUrl = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameName)}&page_size=1`;
        const data = await makeRequest(searchUrl);

        if (data.results && data.results.length > 0) {
            const game = data.results[0];
            // Sometimes search result has metacritic, but sometimes need details.
            // Search result object usually includes 'metacritic'.
            if (game.metacritic) return game.metacritic;

            // If not in search result, fetch details
            const detailUrl = `${RAWG_BASE_URL}/games/${game.id}?key=${RAWG_API_KEY}`;
            const detailData = await makeRequest(detailUrl);
            return detailData.metacritic || null;
        }
    } catch (e) {
        console.error(`Erro ao buscar RAWG para ${gameName}:`, e.message);
    }
    return null;
}

async function run() {
    const client = await pool.connect();
    try {
        console.log("🔍 Buscando jogos sem nota Metacritic...");

        // Find games with null or 0 metacritic
        const res = await client.query('SELECT id, nome FROM jogos WHERE metacritic IS NULL OR metacritic = 0');
        const games = res.rows;

        console.log(`📋 Encontrados ${games.length} jogos para atualizar.`);

        for (const game of games) {
            console.log(`Analyzing: ${game.nome}...`);
            const score = await getMetacritic(game.nome);

            if (score) {
                await client.query('UPDATE jogos SET metacritic = $1 WHERE id = $2', [score, game.id]);
                console.log(`   ✅ Atualizado: ${game.nome} -> ${score}`);
            } else {
                console.log(`   ⚠️  Sem nota disponível na API para: ${game.nome}`);
            }

            // Polite delay
            await new Promise(r => setTimeout(r, 300));
        }

    } catch (err) {
        console.error('Erro geral:', err);
    } finally {
        client.release();
        pool.end();
    }
}

run();
