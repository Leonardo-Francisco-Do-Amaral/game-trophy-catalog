require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

const updates = [
    { name: 'Hades', score: 93 },
    { name: 'Minecraft', score: 93 }, // Matches "Minecraft (PS4)" generically
    { name: 'Watch Dogs 2', score: 82 },
    { name: 'God of War Ragnarök', score: 94 },
    { name: 'Yakuza: Like A Dragon', score: 84 },
    { name: 'Dragon Ball Z: Kakarot', score: 73 },
    { name: 'J-Stars Victory VS+', score: 61 },
    { name: 'Marvel Rivals', score: 74 },
    { name: 'A Plague Tale: Requiem', score: 82 },
    { name: 'MultiVersus', score: 75 }
];

async function runUpdates() {
    const client = await pool.connect();
    try {
        console.log('Iniciando atualização de notas...');
        for (const game of updates) {
            // Use ILIKE with wildcards for flexible matching
            const query = `
                UPDATE jogos 
                SET metacritic = $1 
                WHERE nome ILIKE $2
                RETURNING nome;
            `;
            const searchName = `%${game.name}%`;
            const res = await client.query(query, [game.score, searchName]);

            if (res.rowCount > 0) {
                console.log(`✅ Atualizado: "${res.rows[0].nome}" para nota ${game.score}`);
            } else {
                console.log(`⚠️  Não encontrado: "${game.name}"`);
            }
        }
        console.log('Concluído!');
    } catch (err) {
        console.error('Erro ao atualizar:', err);
    } finally {
        client.release();
        pool.end();
    }
}

runUpdates();
