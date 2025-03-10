export const formatTime = (createdAt) => {
    const now = new Date();
    const date = new Date(createdAt);
    const timeDiff = (now - date) / 1000;
    return timeDiff < 60 
        ? "just now" 
        : `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
};

