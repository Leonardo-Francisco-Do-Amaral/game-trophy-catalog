const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

async function inspectGames() {
    const client = await pool.connect();
    try {
        console.log('🔌 Conectando ao banco de dados...');

        // Check games mentioned by user and recent ones
        const res = await client.query(`
            SELECT id, nome, metacritic, foto_url 
            FROM jogos 
            WHERE nome ILIKE '%Doom%' OR nome ILIKE '%Scarlet%' OR id > (SELECT MAX(id) - 5 FROM jogos)
            ORDER BY id DESC
        `);

        console.log('📋 Dados encontrados:');
        console.table(res.rows);

    } catch (err) {
        console.error('❌ Erro:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

inspectGames();
