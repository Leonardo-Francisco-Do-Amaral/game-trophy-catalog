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

async function verify() {
    try {
        const res = await pool.query(`
            SELECT j.nome, j.genero, j.tipo_jogo, j.tags, cuj.idioma, cuj.dias_para_platina, cuj.completude_jogo
            FROM jogos j
            JOIN configuracoes_usuario_jogo cuj ON j.id = cuj.jogo_id
            ORDER BY j.id DESC
            LIMIT 5
        `);
        console.table(res.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
verify();
