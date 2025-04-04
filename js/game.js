// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 1600;
canvas.height = 1000;

// Browser detection for special handling
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
console.log('Browser detected:', isChrome ? 'Chrome' : 'Other');

// Initialize audio context globally
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.audioContext = new AudioContext();
window.audioEnabled = false;

// Initialize audio unlock function - Chrome specific version
function unlockAudio() {
    console.log('Attempting to unlock audio...');
    
    // Create and play a silent buffer to unlock the audio
    if (!window.audioEnabled) {
        // Chrome requires a user action to resume audio context
        if (isChrome && window.audioContext.state === 'suspended') {
            window.audioContext.resume().then(() => {
                console.log('AudioContext resumed successfully');
            }).catch(e => console.error('Failed to resume AudioContext:', e));
        }
        
        try {
            // Play all sounds at zero volume just to prime them
            Object.values(game.audio).forEach(sound => {
                if (sound instanceof Audio) {
                    sound.volume = 0; // Mute the sound
                    sound.play()
                        .then(() => {
                            sound.pause();
                            sound.currentTime = 0;
                            console.log('Primed audio:', sound.src);
                        })
                        .catch(e => console.log('Could not prime audio:', e));
                }
            });
            
            // Create and play a silent buffer
            const buffer = window.audioContext.createBuffer(1, 1, 22050);
            const source = window.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(window.audioContext.destination);
            source.start(0);
            
            console.log('Audio context unlocked');
            window.audioEnabled = true;
        } catch (e) {
            console.error('Error unlocking audio:', e);
        }
    }
}

// For Chrome, we need a more aggressive approach to unlock audio
if (isChrome) {
    // Setup a visible "Start" button to get user interaction if needed
    const startButton = document.createElement('button');
    startButton.textContent = 'Click to Enable Sound';
    startButton.style.position = 'absolute';
    startButton.style.top = '50%';
    startButton.style.left = '50%';
    startButton.style.transform = 'translate(-50%, -50%)';
    startButton.style.fontSize = '24px';
    startButton.style.padding = '15px 30px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    startButton.style.zIndex = '1000';
    
    // Only show the button if we're in Chrome
    document.body.appendChild(startButton);
    
    startButton.addEventListener('click', () => {
        unlockAudio();
        window.audioEnabled = true;
        startButton.remove(); // Remove after clicked
        
        // Start the game if it hasn't started yet
        if (!window.gameStarted) {
            window.gameStarted = true;
            init();
            gameLoop();
        }
    });
    
    // Alternative methods to unlock audio
    document.addEventListener('click', unlockAudio, { once: false });
    document.addEventListener('touchstart', unlockAudio, { once: false });
    document.addEventListener('keydown', unlockAudio, { once: false });
} else {
    // For non-Chrome browsers, use our standard approach
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
}

// Game state
const game = {
    player: null,
    enemies: [],
    bullets: [],
    explosions: [],
    score: 0,
    wave: 1,
    enemiesDefeated: 0,
    lastEnemySpawn: 0,
    enemySpawnDelay: 1000,
    mouseX: canvas.width / 2,
    mouseY: canvas.height - 100,
    isGameOver: false,
    boss: null,
    isBossWave: false,
    lastWeaponSwitch: 0,
    weaponSwitchDelay: 500, // Prevent too frequent weapon switching
    audio: {
        laser: new Audio('sounds/laser.mp3'),
        plasma: new Audio('sounds/plasma.mp3'),
        ion: new Audio('sounds/ion.mp3'),
        quantum: new Audio('sounds/quantum.mp3'),
        nova: new Audio('sounds/nova.mp3'),
        pulse: new Audio('sounds/pulse.mp3'),
        beam: new Audio('sounds/beam.mp3'),
        wave: new Audio('sounds/wave.mp3'),
        explosion: new Audio('sounds/explosion.mp3'),
        powerup: new Audio('sounds/powerup.mp3'),
        hit: new Audio('sounds/hit.mp3'),
        gameOver: new Audio('sounds/gameover.mp3'),
        bomb: new Audio('sounds/bomb.mp3'),
        isMuted: false,
        volume: 0.5, // Default volume at 50%
        masterVolume: 1.0
    },
    powerUps: [],
    weaponBoostEndTime: 0,
    isWeaponBoosted: false,
    bombCount: 0
};

// Add these new classes at the top of the file
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = 1 + Math.random() * 2;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Nebula {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.width = 200 + Math.random() * 300;
        this.height = 200 + Math.random() * 300;
        this.color = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 255}, 0.1)`;
        this.speed = 0.5 + Math.random() * 1;
    }

    update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -this.height;
            this.x = Math.random() * canvas.width;
        }
    }

    draw(ctx) {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.width/2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Add these properties to the game object
let stars = [];
let nebulae = [];

// Preload audio files
function preloadAudio() {
    return new Promise((resolve) => {
        console.log('Preloading audio files...');
        const audioFiles = Object.values(game.audio).filter(item => item instanceof Audio);
        let loadedCount = 0;
        
        audioFiles.forEach(audio => {
            // Set load event
            audio.addEventListener('canplaythrough', () => {
                loadedCount++;
                console.log(`Loaded audio ${loadedCount}/${audioFiles.length}`);
                if (loadedCount === audioFiles.length) {
                    console.log('All audio files loaded successfully');
                    resolve();
                }
            }, { once: true });
            
            // Set error event
            audio.addEventListener('error', (e) => {
                console.error('Error loading audio:', audio.src, e);
                loadedCount++;
                if (loadedCount === audioFiles.length) {
                    console.log('Audio loading completed with some errors');
                    resolve();
                }
            }, { once: true });
            
            // Force reload
            audio.load();
        });
        
        // Fallback if loading takes too long
        setTimeout(() => {
            console.log('Audio preload timeout - continuing anyway');
            resolve();
        }, 3000);
    });
}

// Initialize game
function init() {
    game.player = new Player(canvas.width / 2, canvas.height - 120);
    game.enemies = [];
    game.bullets = [];
    game.explosions = [];
    game.score = 0;
    game.wave = 1;
    game.enemiesDefeated = 0;
    game.isGameOver = false;
    game.boss = null;
    game.isBossWave = false;
    game.powerUps = [];
    game.weaponBoostEndTime = 0;
    game.isWeaponBoosted = false;
    game.bombCount = 0;
    
    // Event listeners
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        game.mouseX = e.clientX - rect.left;
        game.mouseY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('click', () => {
        if (!game.isGameOver) {
            const bullets = game.player.shoot();
            game.bullets.push(...bullets);
            
            // Play weapon sound using our new function
            playSound(game.player.weaponType);
        } else {
            init(); // Restart game
        }
    });

    // Add weapon switch on right click
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Prevent context menu
        if (!game.isGameOver) {
            const now = Date.now();
            if (now - game.lastWeaponSwitch >= game.weaponSwitchDelay) {
                game.player.cycleWeapon();
                game.lastWeaponSwitch = now;
            }
        }
    });

    // Initialize space background
    for (let i = 0; i < 100; i++) {
        stars.push(new Star());
    }
    for (let i = 0; i < 3; i++) {
        nebulae.push(new Nebula());
    }

    // Initialize audio volume and trigger audio playback once
    updateAudioVolume();
    
    // Attempt to play and then immediately pause all sounds to unblock audio
    Object.values(game.audio).forEach(sound => {
        if (sound instanceof Audio) {
            sound.volume = 0; // Temporarily mute
            sound.play().then(() => {
                sound.pause();
                sound.currentTime = 0;
                sound.volume = game.audio.volume * game.audio.masterVolume;
                console.log('Initialized audio:', sound.src);
            }).catch(e => console.log('Could not initialize audio:', e.message));
        }
    });
}

// Spawn enemies
function spawnEnemy() {
    if (game.isBossWave) return;
    
    const now = Date.now();
    if (now - game.lastEnemySpawn >= game.enemySpawnDelay) {
        game.enemies.push(new Enemy());
        game.lastEnemySpawn = now;
        
        // Adjust spawn rate based on wave
        game.enemySpawnDelay = Math.max(200, 1000 - (game.wave * 50));
    }
}

// Update game state
function update() {
    if (game.isGameOver) return;

    // Update player
    game.player.update(game.mouseX, game.mouseY);

    // Check for boss wave
    if (game.wave % 3 === 0 && !game.isBossWave && game.enemies.length === 0) {
        game.isBossWave = true;
        game.boss = new Boss(game.wave);
    }

    // Spawn enemies if not in boss wave
    if (!game.isBossWave) {
        spawnEnemy();
    }

    // Update bullets
    game.bullets = game.bullets.filter(bullet => !bullet.update());

    // Update enemies
    game.enemies = game.enemies.filter(enemy => {
        const isOutOfBounds = enemy.update();
        if (isOutOfBounds) {
            // Instead of game over, just remove the enemy and continue
            game.score = Math.max(0, game.score - 5); // Small score penalty for letting enemies escape
            return false;
        }
        return true;
    });

    // Update boss
    if (game.boss) {
        game.boss.update(game.mouseX, game.mouseY);
        
        // Check boss bullet collisions
        game.boss.bullets.forEach(bullet => {
            if (Utils.checkCollision(bullet, game.player)) {
                if (game.player.takeDamage()) {
                    game.isGameOver = true;
                    // Play hit sound
                    playSound('hit');
                }
            }
        });

        // Check boss missile collisions
        game.boss.missiles.forEach(missile => {
            if (Utils.checkCollision(missile, game.player)) {
                if (game.player.takeDamage()) {
                    game.isGameOver = true;
                    // Play hit sound
                    playSound('hit');
                }
            }
        });
    }

    // Update explosions
    game.explosions = game.explosions.filter(explosion => !explosion.update());

    // Update power-ups
    game.powerUps = game.powerUps.filter(powerUp => !powerUp.update());

    // Check power-up collisions with player
    game.powerUps.forEach((powerUp, index) => {
        if (Utils.checkCollision(powerUp, game.player)) {
            if (powerUp.type === 'weapon') {
                game.isWeaponBoosted = true;
                game.weaponBoostEndTime = Date.now() + 10000; // 10 seconds
            } else if (powerUp.type === 'bomb') {
                game.bombCount++;
                // Play bomb pickup sound
                playSound('bomb');
            }
            // Play power-up sound
            playSound('powerup');
            game.powerUps.splice(index, 1);
        }
    });

    // Check if weapon boost has expired
    if (game.isWeaponBoosted && Date.now() > game.weaponBoostEndTime) {
        game.isWeaponBoosted = false;
    }

    // Check collisions
    game.enemies.forEach((enemy, enemyIndex) => {
        game.bullets.forEach((bullet, bulletIndex) => {
            if (Utils.checkCollision(enemy, bullet)) {
                // Remove enemy and bullet
                game.enemies.splice(enemyIndex, 1);
                game.bullets.splice(bulletIndex, 1);
                
                // Add explosion
                game.explosions.push(new Explosion(enemy.x, enemy.y, enemy.baseColor));
                
                // Play explosion sound with the new function
                playSound('explosion');
                
                // Check for power-up drop
                if (enemy.willDropPowerUp) {
                    game.powerUps.push(new PowerUp(enemy.x, enemy.y, enemy.powerUpType));
                }
                
                // Update score and check for weapon upgrade
                game.score += 10;
                game.enemiesDefeated++;
                
                if (game.enemiesDefeated % 10 === 0 && game.player.weaponLevel < 3) {
                    game.player.weaponLevel++;
                }
                
                if (game.enemiesDefeated % 30 === 0) {
                    game.wave++;
                    game.enemySpawnDelay = Math.max(200, game.enemySpawnDelay - 100);
                }
            }
        });

        // Check collision with player
        if (Utils.checkCollision(enemy, game.player)) {
            if (game.player.takeDamage()) {
                game.isGameOver = true;
                // Play hit sound
                playSound('hit');
            }
        }
    });

    // Check boss collisions
    if (game.boss) {
        game.bullets.forEach((bullet, bulletIndex) => {
            if (Utils.checkCollision(bullet, game.boss)) {
                game.bullets.splice(bulletIndex, 1);
                if (game.boss.takeDamage(10)) {
                    // Boss defeated
                    for (let i = 0; i < 5; i++) {
                        game.explosions.push(new Explosion(
                            game.boss.x + Utils.random(-game.boss.width/2, game.boss.width/2),
                            game.boss.y + Utils.random(-game.boss.height/2, game.boss.height/2),
                            game.boss.color
                        ));
                    }
                    // Play explosion sound
                    playSound('explosion');
                    
                    game.score += 100;
                    game.wave++;
                    game.boss = null;
                    game.isBossWave = false;
                }
            }
        });

        // Check collision with player
        if (Utils.checkCollision(game.boss, game.player)) {
            if (game.player.takeDamage()) {
                game.isGameOver = true;
                // Play hit sound
                playSound('hit');
            }
        }

        // Check boss bullet collisions
        game.boss.bullets.forEach(bullet => {
            if (Utils.checkCollision(bullet, game.player)) {
                if (game.player.takeDamage()) {
                    game.isGameOver = true;
                    // Play hit sound
                    playSound('hit');
                }
            }
        });

        // Check boss missile collisions
        game.boss.missiles.forEach(missile => {
            if (Utils.checkCollision(missile, game.player)) {
                if (game.player.takeDamage()) {
                    game.isGameOver = true;
                    // Play hit sound
                    playSound('hit');
                }
            }
        });
    }

    // Update space background
    stars.forEach(star => star.update());
    nebulae.forEach(nebula => nebula.update());
}

// Render game
function render() {
    // Clear canvas with dark blue background
    ctx.fillStyle = '#0C1D3B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw space background
    nebulae.forEach(nebula => nebula.draw(ctx));
    stars.forEach(star => star.draw(ctx));

    // Draw game objects
    game.player.draw(ctx);
    game.enemies.forEach(enemy => enemy.draw(ctx));
    game.bullets.forEach(bullet => bullet.draw(ctx));
    game.explosions.forEach(explosion => explosion.draw(ctx));
    
    // Draw boss and its projectiles
    if (game.boss) {
        game.boss.draw(ctx);
        game.boss.bullets.forEach(bullet => bullet.draw(ctx));
        game.boss.missiles.forEach(missile => missile.draw(ctx));

        // Draw boss health bar
        const bossHealthWidth = 600;
        const bossHealthHeight = 30;
        const bossHealthX = (canvas.width - bossHealthWidth) / 2;
        const bossHealthY = 20;

        // Health bar background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(bossHealthX - 5, bossHealthY - 5, bossHealthWidth + 10, bossHealthHeight + 10);

        // Health bar
        ctx.fillStyle = '#ff3333';
        const healthPercentage = game.boss.health / game.boss.maxHealth;
        ctx.fillRect(bossHealthX, bossHealthY, bossHealthWidth * healthPercentage, bossHealthHeight);

        // Health text
        ctx.fillStyle = '#fff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS', canvas.width / 2, bossHealthY + bossHealthHeight + 30);
    }

    // Draw power-ups
    game.powerUps.forEach(powerUp => powerUp.draw(ctx));

    // Draw weapon boost indicator if active
    if (game.isWeaponBoosted) {
        const timeLeft = Math.max(0, game.weaponBoostEndTime - Date.now());
        const timePercentage = timeLeft / 10000;
        
        ctx.fillStyle = '#ff00ff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Weapon Boost: ${Math.ceil(timeLeft/1000)}s`, canvas.width - 40, 130);
        
        // Draw boost bar
        ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
        ctx.fillRect(canvas.width - 200, 140, 160, 10);
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(canvas.width - 200, 140, 160 * timePercentage, 10);
    }

    // Draw bomb count if available
    if (game.bombCount > 0) {
        ctx.fillStyle = '#ff6600';
        ctx.font = '24px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`Bombs: ${game.bombCount}`, canvas.width - 40, 170);
        ctx.fillText('Press B to use', canvas.width - 40, 200);
    }

    // Draw audio controls
    drawAudioControls(ctx);

    // Draw game over screen
    if (game.isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '96px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 80);
        
        ctx.font = '48px Arial';
        ctx.fillText(`Final Score: ${game.score}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 100);
    } else {
        // Draw score and wave in top-left corner
        ctx.fillStyle = '#00ff00';  // Green for score
        ctx.font = '32px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${game.score}`, 40, 50);
        
        ctx.fillStyle = '#ff9900';  // Orange for wave
        ctx.fillText(`Wave: ${game.wave}`, 40, 90);

        // Draw weapon info in top-right corner
        ctx.textAlign = 'right';
        ctx.fillStyle = game.player.getWeaponColor();
        ctx.fillText(`${game.player.weaponType.toUpperCase()} - Level ${game.player.weaponLevel}`, canvas.width - 40, 50);
    }
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start game after preloading audio
window.addEventListener('load', () => {
    window.gameStarted = false;
    
    preloadAudio().then(() => {
        console.log('Audio preloading completed');
        
        // For non-Chrome browsers, start the game immediately
        if (!isChrome) {
            window.gameStarted = true;
            console.log('Starting game automatically');
            init();
            gameLoop();
        } else {
            console.log('Waiting for user interaction in Chrome before starting');
            // For Chrome, the game starts when the user clicks the start button
        }
    });
});

// Add this function to handle audio volume
function updateAudioVolume() {
    const volume = game.audio.isMuted ? 0 : game.audio.volume * game.audio.masterVolume;
    Object.values(game.audio).forEach(sound => {
        if (sound instanceof Audio) {
            sound.volume = volume;
        }
    });
}

// Add this function to draw the audio controls
function drawAudioControls(ctx) {
    const buttonSize = 40;
    const padding = 10;
    const x = canvas.width - buttonSize - padding;
    const y = padding;

    // Draw mute button
    ctx.fillStyle = game.audio.isMuted ? '#ff4444' : '#44ff44';
    ctx.beginPath();
    ctx.arc(x + buttonSize/2, y + buttonSize/2, buttonSize/2, 0, Math.PI * 2);
    ctx.fill();

    // Draw speaker icon
    ctx.fillStyle = '#000';
    ctx.beginPath();
    if (game.audio.isMuted) {
        // Draw muted icon (speaker with X)
        ctx.moveTo(x + buttonSize/4, y + buttonSize/4);
        ctx.lineTo(x + buttonSize*3/4, y + buttonSize*3/4);
        ctx.moveTo(x + buttonSize*3/4, y + buttonSize/4);
        ctx.lineTo(x + buttonSize/4, y + buttonSize*3/4);
    } else {
        // Draw speaker icon
        ctx.moveTo(x + buttonSize/3, y + buttonSize/4);
        ctx.lineTo(x + buttonSize/3, y + buttonSize*3/4);
        ctx.lineTo(x + buttonSize/2, y + buttonSize*3/4);
        ctx.lineTo(x + buttonSize/2, y + buttonSize/4);
        ctx.lineTo(x + buttonSize/3, y + buttonSize/4);
    }
    ctx.stroke();
}

// Add click handler for audio controls
canvas.addEventListener('click', (e) => {
    const buttonSize = 40;
    const padding = 10;
    const x = canvas.width - buttonSize - padding;
    const y = padding;

    // Check if click is within mute button
    const clickX = e.offsetX;
    const clickY = e.offsetY;
    const distance = Math.sqrt(
        Math.pow(clickX - (x + buttonSize/2), 2) + 
        Math.pow(clickY - (y + buttonSize/2), 2)
    );

    if (distance <= buttonSize/2) {
        game.audio.isMuted = !game.audio.isMuted;
        updateAudioVolume();
        // Stop event propagation to prevent shooting when clicking the mute button
        e.stopPropagation();
        
        console.log('Audio mute toggled:', game.audio.isMuted);
    }
}, { capture: true }); // Use capture phase to handle this before the shooting event

// Add bomb key handler
document.addEventListener('keydown', (e) => {
    if (e.key === 'b' && game.bombCount > 0 && !game.isGameOver) {
        // Activate bomb
        game.bombCount--;
        // Play bomb sound
        playSound('bomb');
        
        // Destroy all enemies on screen
        game.enemies.forEach(enemy => {
            game.explosions.push(new Explosion(enemy.x, enemy.y, enemy.baseColor));
            game.score += 10;
            game.enemiesDefeated++;
        });
        game.enemies = [];
        
        // Also damage boss if present
        if (game.boss) {
            game.boss.takeDamage(50);
        }
    }
});

// Update game state by adding gameOver sound when player dies
if (game.player.takeDamage()) {
    game.isGameOver = true;
    // Play hit sound
    playSound('hit');
    
    // Play game over sound after a short delay
    setTimeout(() => {
        playSound('gameOver');
    }, 500);
}

// Add a dedicated sound function at the end of the file
function playSound(soundType) {
    // Chrome-specific handling
    if (isChrome && window.audioContext.state === 'suspended') {
        window.audioContext.resume().catch(e => console.error('Error resuming audio context:', e));
    }
    
    // Force user interaction for first sound
    if (!window.audioEnabled) {
        console.log('Audio needs user interaction to play');
        return;
    }
    
    // Play the actual sound
    if (game.audio[soundType] && !game.audio.isMuted) {
        try {
            // Create a new audio instance to allow overlapping sounds
            const sound = new Audio(game.audio[soundType].src);
            sound.volume = game.audio.volume * game.audio.masterVolume;
            
            // Chrome-specific: use Web Audio API for better compatibility
            if (isChrome) {
                const source = window.audioContext.createMediaElementSource(sound);
                source.connect(window.audioContext.destination);
                sound.play().catch(error => console.error('Sound play failed:', error));
            } else {
                sound.play().catch(error => console.error('Sound play failed:', error));
            }
            
            console.log('Playing sound:', soundType);
        } catch (e) {
            console.error('Error creating sound:', e);
        }
    }
} 