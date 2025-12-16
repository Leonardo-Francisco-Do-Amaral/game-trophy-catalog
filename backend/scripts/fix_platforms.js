require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

async function fixPlatforms() {
    try {
        console.log('🔌 Conectando ao banco de dados...');
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Update PlayStation 4 -> PS4
            const resPS4 = await client.query(`
                UPDATE configuracoes_usuario_jogo 
                SET plataforma = 'PS4' 
                WHERE plataforma = 'PlayStation 4'
            `);
            console.log(`✅ Atualizados ${resPS4.rowCount} registros de 'PlayStation 4' para 'PS4'.`);

            // Update PlayStation 5 -> PS5
            const resPS5 = await client.query(`
                UPDATE configuracoes_usuario_jogo 
                SET plataforma = 'PS5' 
                WHERE plataforma = 'PlayStation 5'
            `);
            console.log(`✅ Atualizados ${resPS5.rowCount} registros de 'PlayStation 5' para 'PS5'.`);

            await client.query('COMMIT');
            console.log('🚀 Migração concluída com sucesso!');

        } catch (err) {
            await client.query('ROLLBACK');
            console.error('❌ Erro durante a migração:', err);
        } finally {
            client.release();
        }

    } catch (err) {
        console.error('❌ Erro ao conectar ao banco:', err);
    } finally {
        await pool.end();
    }
}

fixPlatforms();
