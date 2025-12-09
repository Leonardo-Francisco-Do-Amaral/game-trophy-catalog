const API_BASE_URL = 'http://localhost:3001/api';

export const api = {
    getGames: async () => {
        const response = await fetch(`${API_BASE_URL}/jogos`);
        if (!response.ok) throw new Error(`Erro na API! Status: ${response.status}`);
        return response.json();
    },

    getGameById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/jogos/${id}`);
        if (!response.ok) throw new Error('Não foi possível carregar os dados do jogo.');
        return response.json();
    },

    createGame: async (gameData) => {
        const response = await fetch(`${API_BASE_URL}/jogos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao salvar o jogo.');
        }
        return response.json();
    },

    updateGame: async (id, gameData) => {
        const response = await fetch(`${API_BASE_URL}/jogos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao atualizar o jogo.');
        }
        return response.json();
    },

    // RAWG API Helper (Proxy via backend or direct if key is exposed - keeping direct for now as per original code, but ideally should be backend)
    // For now, let's keep RAWG logic in the component or move here if we want to abstract it.
    // Given the original code had it in component, let's leave it there for this step or move it.
    // Let's stick to backend API for this file.
};
