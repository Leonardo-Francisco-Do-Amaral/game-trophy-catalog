const { Pool } = require('pg');
const path = require('path');
try { require('dotenv').config({ path: path.join(__dirname, '../.env') }); } catch (e) { require('dotenv').config(); }

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

async function fix() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Fix completude_jogo
        // Users input "platinado - não possui DLC" was mapped to "nao_platinado" erroneously.
        // We fix this by checking if trophies obtained == trophies total (indicating platinum/100%)
        // and setting it to 'platinado_nao_possui_dlc' (or 'platinado_sem_dlc' if preferred, but user used 'não possui DLC')

        const resFix = await client.query(`
            UPDATE configuracoes_usuario_jogo
            SET completude_jogo = 'platinado_nao_possui_dlc'
            WHERE completude_jogo = 'nao_platinado' 
            AND trofeus_totais > 0 
            AND trofeus_obtidos = trofeus_totais
        `);
        console.log(`Updated ${resFix.rowCount} rows for completude_jogo.`);

        // Fix specific tag typo: "NarrativaRamificadaDesafioQTE" -> "NarrativaRamificada", "DesafioQTE"
        // We need to fetch games with this tag, fix the JSON, and update.
        const resTags = await client.query(`
            SELECT id, tags FROM jogos 
            WHERE tags LIKE '%NarrativaRamificadaDesafioQTE%'
        `);

        for (const row of resTags.rows) {
            let tags = JSON.parse(row.tags);
            const index = tags.indexOf('NarrativaRamificadaDesafioQTE');
            if (index !== -1) {
                tags.splice(index, 1, 'NarrativaRamificada', 'DesafioQTE');
                await client.query('UPDATE jogos SET tags = $1 WHERE id = $2', [JSON.stringify(tags), row.id]);
                console.log(`Fixed tags for game ID ${row.id}`);
            }
        }

        await client.query('COMMIT');
        console.log('Fixes applied successfully.');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);
    } finally {
        client.release();
        pool.end();
    }
}
fix();
