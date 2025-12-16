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

const RAWG_API_KEY = process.env.RAWG_API_KEY || '656d689bf531403b95aa1d95d29de23e'; // Fallback key if env not set

function fetchGameDetails(gameName) {
    return new Promise((resolve, reject) => {
        const slug = gameName.toLowerCase()
            .replace(/:/g, '')
            .replace(/'/g, '')
            .replace(/\./g, '')
            .replace(/&/g, 'and')
            .replace(/\s+/g, '-');

        const url = `https://api.rawg.io/api/games/${slug}?key=${RAWG_API_KEY}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const gameData = JSON.parse(data);
                        resolve(gameData);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    resolve(null); // Game not found or error
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function updateMetacriticScores() {
    const client = await pool.connect();
    try {
        console.log('🔌 Conectando ao banco de dados...');

        const res = await client.query('SELECT id, nome FROM jogos WHERE metacritic IS NULL');
        const games = res.rows;

        console.log(`📋 Encontrados ${games.length} jogos sem nota do Metacritic.`);

        for (const game of games) {
            console.log(`🔍 Buscando nota para: ${game.nome}...`);

            try {
                const details = await fetchGameDetails(game.nome);

                if (details && details.metacritic) {
                    await client.query('UPDATE jogos SET metacritic = $1 WHERE id = $2', [details.metacritic, game.id]);
                    console.log(`✅ Nota atualizada para ${game.nome}: ${details.metacritic}`);
                } else {
                    console.log(`⚠️ Nota não encontrada para ${game.nome} (ou jogo não achado na RAWG).`);
                }

                // Delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (err) {
                console.error(`❌ Erro ao processar ${game.nome}:`, err.message);
            }
        }

        console.log('🏁 Atualização concluída!');

    } catch (err) {
        console.error('❌ Erro geral:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

updateMetacriticScores();
