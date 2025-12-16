const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'game_trophy_catalog', // Hardcoded correct DB
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function addTagsColumn() {
    try {
        await client.connect();
        console.log('🔌 Conectado ao banco de dados: game_trophy_catalog');

        const checkQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='jogos' AND column_name='tags';
        `;
        const checkRes = await client.query(checkQuery);

        if (checkRes.rows.length === 0) {
            console.log('⚠️ Coluna "tags" não encontrada. Adicionando...');
            const alterQuery = `ALTER TABLE jogos ADD COLUMN tags TEXT;`;
            await client.query(alterQuery);
            console.log('✅ Coluna "tags" adicionada com sucesso!');
        } else {
            console.log('ℹ️ Coluna "tags" já existe.');
        }

    } catch (err) {
        console.error('❌ Erro ao atualizar banco de dados:', err);
    } finally {
        await client.end();
        console.log('🔌 Desconectado.');
    }
}

addTagsColumn();
