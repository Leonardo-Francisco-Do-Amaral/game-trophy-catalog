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

async function addMetacriticColumn() {
    try {
        console.log('🔌 Conectando ao banco de dados...');
        const client = await pool.connect();

        console.log('🛠️ Adicionando coluna metacritic...');
        await client.query(`
            ALTER TABLE jogos 
            ADD COLUMN IF NOT EXISTS metacritic INTEGER;
        `);

        console.log('✅ Coluna metacritic adicionada com sucesso!');
        client.release();
    } catch (err) {
        console.error('❌ Erro ao adicionar coluna:', err);
    } finally {
        await pool.end();
    }
}

addMetacriticColumn();
