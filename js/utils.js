// Utility functions for the game
const Utils = {
    // Random number between min and max
    random: (min, max) => Math.random() * (max - min) + min,
    
    // Random integer between min and max (inclusive)
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Calculate distance between two points
    distance: (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
    
    // Generate random color
    randomColor: () => {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    // Check collision between two objects
    checkCollision: (obj1, obj2) => {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    },
    
    // Clamp a value between min and max
    clamp: (value, min, max) => Math.min(Math.max(value, min), max)
}; 