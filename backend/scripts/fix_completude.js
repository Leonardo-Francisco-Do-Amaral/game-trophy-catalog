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

async function fixCompletude() {
    const client = await pool.connect();
    try {
        console.log('🛠️ Corrigindo valores de completude_jogo...');

        await client.query('BEGIN');

        // 1. Platinado com DLC
        // De: "platinado - Com DLC", "platinado_com_dlc"
        // Para: "platinado com dlc"
        await client.query(`
            UPDATE configuracoes_usuario_jogo
            SET completude_jogo = 'platinado com dlc'
            WHERE completude_jogo ILIKE '%platinado%com%dlc%'
               OR completude_jogo = 'platinado_com_dlc';
        `);

        // 2. Platinado sem DLC
        // De: "platinado - Sem DLC", "platinado_sem_dlc"
        // Para: "platinado sem dlc"
        await client.query(`
            UPDATE configuracoes_usuario_jogo
            SET completude_jogo = 'platinado sem dlc'
            WHERE completude_jogo ILIKE '%platinado%sem%dlc%'
               OR completude_jogo = 'platinado_sem_dlc';
        `);

        // 3. Platinado (Não possui DLC)
        // De: "platinado - não possui DLC", "platinado_nao_possui_dlc"
        // Para: "platinado nao possui dlc"
        await client.query(`
            UPDATE configuracoes_usuario_jogo
            SET completude_jogo = 'platinado nao possui dlc'
            WHERE completude_jogo ILIKE '%platinado%n_o%possui%dlc%'
               OR completude_jogo = 'platinado_nao_possui_dlc';
        `);

        await client.query('COMMIT');
        console.log('✅ Valores corrigidos com sucesso!');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Erro ao corrigir valores:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

fixCompletude();
