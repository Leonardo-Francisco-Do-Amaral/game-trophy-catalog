const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'game_trophy_catalog', // Hardcoded as seen in previous files
});

async function debugTags() {
    try {
        console.log('Connecting to DB...');
        const res = await pool.query('SELECT id, nome, tags FROM jogos ORDER BY id DESC LIMIT 10');
        console.log('Last 10 games tags:');
        res.rows.forEach(row => {
            console.log(`[${row.id}] ${row.nome}:`, row.tags);
            console.log('Type:', typeof row.tags);
            console.log('-------------------');
        });
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

debugTags();
