
// Mock of the shared data from badges.js (since we can't import easily in this context)
const BADGE_CATEGORIES = {
    'Temas/Características': {
        badges: [
            { id: 'RemasterRemake', label: 'Revitalizado' },
            { id: 'EstiloAnime', label: 'Anime' }
        ]
    },
    'Premiações': {
        badges: [
            { id: 'VencedorGOTY', label: 'GOTY' }
        ]
    }
};

const LEGACY_BADGE_MAP = {
    'Remaster/Remake': 'RemasterRemake',
    'Estilo Anime': 'EstiloAnime',
    'Anime': 'EstiloAnime',
    'Vencedor do GOTY': 'VencedorGOTY'
};

// Logic from CadastroJogo.jsx
function normalizeTags(loadedTags) {
    const allBadgesFlat = Object.values(BADGE_CATEGORIES).flatMap(c => c.badges);
    const normalizedTags = loadedTags.map(tag => {
        const cleanTag = tag.replace(/['"{}\\]/g, '').trim();
        // 1. First check if it is already a known NEW ID
        if (allBadgesFlat.some(b => b.id === cleanTag)) return cleanTag;

        // 2. Check if it is a LEGACY tag that can be mapped
        if (LEGACY_BADGE_MAP[cleanTag]) return LEGACY_BADGE_MAP[cleanTag];

        // 3. Fallback: try finding by label (less reliable but good backup)
        const match = allBadgesFlat.find(b => b.label === cleanTag);
        return match ? match.id : cleanTag;
    });
    // Unique
    return [...new Set(normalizedTags)];
}

// Test Cases
const testCases = [
    { input: ['Remaster/Remake', 'Estilo Anime'], expected: ['RemasterRemake', 'EstiloAnime'] }, // Basic Legacy
    { input: ['RemasterRemake', 'EstiloAnime'], expected: ['RemasterRemake', 'EstiloAnime'] },   // Already fixed
    { input: ['Remaster/Remake', 'RemasterRemake'], expected: ['RemasterRemake'] },             // Duplicates mixed
    { input: ['UnknownTag'], expected: ['UnknownTag'] },                                        // Unknown preserved
    { input: ['Vencedor do GOTY'], expected: ['VencedorGOTY'] }                                 // Another category
];

console.log("Running Mapping Logic Tests...\n");

let passed = 0;
testCases.forEach((tc, idx) => {
    const result = normalizeTags(tc.input);
    const resultJson = JSON.stringify(result.sort());
    const expectedJson = JSON.stringify(tc.expected.sort());

    if (resultJson === expectedJson) {
        console.log(`✅ Test ${idx + 1} Passed: ${JSON.stringify(tc.input)} -> ${resultJson}`);
        passed++;
    } else {
        console.error(`❌ Test ${idx + 1} Failed: ${JSON.stringify(tc.input)}\n   Expected: ${expectedJson}\n   Got:      ${resultJson}`);
    }
});

if (passed === testCases.length) {
    console.log("\nAll logic tests passed!");
} else {
    console.error(`\nFailed ${testCases.length - passed} tests.`);
    process.exit(1);
}
