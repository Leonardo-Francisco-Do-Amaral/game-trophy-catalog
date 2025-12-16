require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

async function listBadges() {
    try {
        const res = await pool.query('SELECT id, nome, tags FROM jogos ORDER BY id');

        console.log('\n--- JOGOS E SUAS BADGES (Do Banco de Dados) ---');
        res.rows.forEach(game => {
            let tags = [];
            try {
                if (typeof game.tags === 'string') {
                    if (game.tags.startsWith('[')) tags = JSON.parse(game.tags);
                    else if (game.tags.includes(',')) tags = game.tags.split(',').map(t => t.trim());
                    else if (game.tags) tags = [game.tags];
                } else if (Array.isArray(game.tags)) {
                    tags = game.tags;
                }
            } catch (e) {
                tags = ['Erro ao ler tags'];
            }

            if (tags.length > 0) {
                console.log(`ID ${game.id}: ${game.nome}`);
                console.log(`   Badges: ${tags.join(', ')}`);
                console.log('------------------------------------------------');
            } else {
                console.log(`ID ${game.id}: ${game.nome}`);
                console.log(`   (Sem badges)`);
                console.log('------------------------------------------------');
            }
        });

    } catch (err) {
        console.error('Erro ao buscar dados:', err);
    } finally {
        pool.end();
    }
}

listBadges();
