export const avatarColors = [     
    '#FF6B6B', 
    '#4ECDC4', 
    '#45B7D1', 
    '#96CEB4', 
    '#9D50BB', 
    '#FFB75E', 
    '#4A90E2', 
    '#58D68D', 
    '#FAD7A1', 
    '#F5B7B1',
    '#D5DBDB', 
    '#E8DAEF', 
    '#F9E79F', 
    '#D2B4DE', 
    '#A3E4D7', 
    ];

export const getUserColor = (userId) => {
    if (!userId) return avatarColors[0];
    const numberFromId = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarColors[numberFromId % avatarColors.length];
};