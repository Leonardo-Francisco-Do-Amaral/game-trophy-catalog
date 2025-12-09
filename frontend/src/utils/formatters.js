export const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('pt-BR');
};

export const formatTotalTime = (hours, minutes) => {
    const h = hours || 0;
    const m = minutes || 0;
    if (h === 0 && m === 0) return 'N/A';

    let timeString = '';
    if (h > 0) timeString += `${h}h`;
    if (m > 0) timeString += ` ${m}m`;

    return timeString.trim();
};

export const normPlatform = (p) => {
    if (["PS5", "PlayStation 5"].includes(p)) return "PS5";
    if (["PS4", "PlayStation 4"].includes(p)) return "PS4";
    return p;
};

export const getPlatformChipStyle = (plataforma) => {
    const norm = normPlatform(plataforma);
    if (norm === "PS5") {
        return { backgroundColor: '#000000', color: 'white', fontWeight: 'bold' };
    }
    if (norm === "PS4") {
        return { backgroundColor: '#09294aff', color: 'white', fontWeight: 'bold' };
    }
    return { backgroundColor: '#f5f5f5', color: '#333' };
};
