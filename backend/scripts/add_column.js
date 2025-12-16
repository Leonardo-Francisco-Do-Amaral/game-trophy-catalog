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

async function addColumn() {
    try {
        console.log('🔌 Conectando ao banco de dados...');
        const client = await pool.connect();

        console.log('🛠️ Adicionando coluna tipo_midia...');
        await client.query(`
            ALTER TABLE configuracoes_usuario_jogo 
            ADD COLUMN IF NOT EXISTS tipo_midia VARCHAR(50);
        `);

        console.log('✅ Coluna adicionada com sucesso!');
        client.release();
    } catch (err) {
        console.error('❌ Erro ao adicionar coluna:', err);
    } finally {
        await pool.end();
    }
}

addColumn();
