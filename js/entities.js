// Player spaceship class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;  // Wider ship to match reference
        this.height = 100; // Taller ship to match reference
        this.speed = 5;
        this.weaponLevel = 1;
        this.weaponType = 'laser';
        this.engineGlow = 0;
        this.engineGlowSpeed = 0.1;
        this.engineGlowMax = 1;
        this.shieldPulse = 0;
        this.shieldPulseSpeed = 0.05;
        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.invulnerableTime = 0;
        this.invulnerableDuration = 1000; // 1 second of invulnerability after taking damage
    }

    draw(ctx) {
        ctx.save();

        // Draw invulnerability effect
        if (this.invulnerableTime > 0) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                this.x - this.width/2 - 5,
                this.y - this.height/2 - 5,
                this.width + 10,
                this.height + 10
            );
        }

        // Engine glow effect - bottom center
        this.engineGlow = (this.engineGlow + this.engineGlowSpeed) % 1;
        const engineGlowSize = 15 + Math.sin(this.engineGlow * Math.PI * 2) * 3;
        
        const mainEngineGradient = ctx.createRadialGradient(
            this.x, this.y + this.height/2,
            0,
            this.x, this.y + this.height/2,
            engineGlowSize
        );
        mainEngineGradient.addColorStop(0, 'rgba(0, 255, 255, 0.9)');
        mainEngineGradient.addColorStop(0.5, 'rgba(0, 150, 255, 0.6)');
        mainEngineGradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
        ctx.fillStyle = mainEngineGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y + this.height/2, engineGlowSize, 0, Math.PI * 2);
        ctx.fill();

        // Ship base - metallic white/light gray
        const shipBaseGradient = ctx.createLinearGradient(
            this.x - this.width/2, this.y,
            this.x + this.width/2, this.y
        );
        shipBaseGradient.addColorStop(0, '#e8e8e8');
        shipBaseGradient.addColorStop(0.3, '#ffffff');
        shipBaseGradient.addColorStop(0.7, '#ffffff');
        shipBaseGradient.addColorStop(1, '#e8e8e8');
        
        // Main fuselage
        ctx.fillStyle = shipBaseGradient;
        ctx.beginPath();
        // Main body shape - elongated like reference
        ctx.moveTo(this.x, this.y - this.height/2); // Nose
        ctx.lineTo(this.x - this.width/6, this.y - this.height/2 + this.height/10); // Slight taper at top
        ctx.lineTo(this.x - this.width/4, this.y - this.height/3); // Upper side
        ctx.lineTo(this.x - this.width/2, this.y - this.height/6); // Wing joint top
        ctx.lineTo(this.x - this.width/2, this.y + this.height/6); // Wing joint bottom
        ctx.lineTo(this.x - this.width/4, this.y + this.height/3); // Lower side
        ctx.lineTo(this.x - this.width/6, this.y + this.height/2 - this.height/10); // Bottom taper
        ctx.lineTo(this.x + this.width/6, this.y + this.height/2 - this.height/10); // Bottom taper (right)
        ctx.lineTo(this.x + this.width/4, this.y + this.height/3); // Lower side (right)
        ctx.lineTo(this.x + this.width/2, this.y + this.height/6); // Wing joint bottom (right)
        ctx.lineTo(this.x + this.width/2, this.y - this.height/6); // Wing joint top (right)
        ctx.lineTo(this.x + this.width/4, this.y - this.height/3); // Upper side (right)
        ctx.lineTo(this.x + this.width/6, this.y - this.height/2 + this.height/10); // Slight taper at top (right)
        ctx.closePath();
        ctx.fill();
        
        // Wing structures - slightly darker gray
        const wingGradient = ctx.createLinearGradient(
            this.x - this.width/2, this.y,
            this.x + this.width/2, this.y
        );
        wingGradient.addColorStop(0, '#d0d0d0');
        wingGradient.addColorStop(0.5, '#e0e0e0');
        wingGradient.addColorStop(1, '#d0d0d0');
        
        // Left wing
        ctx.fillStyle = wingGradient;
        ctx.beginPath();
        ctx.moveTo(this.x - this.width/3, this.y - this.height/6); // Wing root top
        ctx.lineTo(this.x - this.width/2 - this.width/8, this.y - this.height/7); // Wing tip top
        ctx.lineTo(this.x - this.width/2 - this.width/8, this.y + this.height/7); // Wing tip bottom
        ctx.lineTo(this.x - this.width/3, this.y + this.height/6); // Wing root bottom
        ctx.closePath();
        ctx.fill();
        
        // Right wing
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/3, this.y - this.height/6); // Wing root top
        ctx.lineTo(this.x + this.width/2 + this.width/8, this.y - this.height/7); // Wing tip top
        ctx.lineTo(this.x + this.width/2 + this.width/8, this.y + this.height/7); // Wing tip bottom
        ctx.lineTo(this.x + this.width/3, this.y + this.height/6); // Wing root bottom
        ctx.closePath();
        ctx.fill();
        
        // Cockpit - blue glass like reference
        const cockpitGradient = ctx.createLinearGradient(
            this.x, this.y - this.height/5,
            this.x, this.y + this.height/10
        );
        cockpitGradient.addColorStop(0, 'rgba(135, 206, 235, 0.9)');
        cockpitGradient.addColorStop(0.5, 'rgba(30, 144, 255, 0.7)');
        cockpitGradient.addColorStop(1, 'rgba(0, 91, 150, 0.8)');
        
        ctx.fillStyle = cockpitGradient;
        ctx.beginPath();
        // Elongated oval cockpit
        ctx.ellipse(
            this.x, this.y - this.height/10,
            this.width/6, this.height/5,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Detail lines
        ctx.strokeStyle = '#a0a0a0';
        ctx.lineWidth = 1;
        
        // Fuselage panel lines
        ctx.beginPath();
        // Horizontal lines on main body
        for (let i = 1; i <= 6; i++) {
            const y = this.y - this.height/2 + (this.height * i/7);
            ctx.moveTo(this.x - this.width/4, y);
            ctx.lineTo(this.x + this.width/4, y);
        }
        // Vertical center line
        ctx.moveTo(this.x, this.y - this.height/2 + this.height/10);
        ctx.lineTo(this.x, this.y + this.height/2 - this.height/10);
        ctx.stroke();
        
        // Accent highlights
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 1;
        // Orange accents on wings
        ctx.beginPath();
        // Left wing accent
        ctx.moveTo(this.x - this.width/3, this.y - this.height/10);
        ctx.lineTo(this.x - this.width/2 - this.width/10, this.y - this.height/10);
        // Right wing accent
        ctx.moveTo(this.x + this.width/3, this.y - this.height/10);
        ctx.lineTo(this.x + this.width/2 + this.width/10, this.y - this.height/10);
        ctx.stroke();
        
        // Small technical details
        ctx.fillStyle = '#00aaff';
        // Engine outlets
        ctx.fillRect(this.x - this.width/8, this.y + this.height/2 - this.height/12, this.width/10, this.height/20);
        ctx.fillRect(this.x + this.width/8 - this.width/10, this.y + this.height/2 - this.height/12, this.width/10, this.height/20);
        
        // Health indicators
        const healthSpacing = 25; // Increased spacing
        for (let i = 0; i < this.maxHealth; i++) {
            // Draw health block container
            ctx.fillStyle = '#444';
            ctx.fillRect(
                this.x - ((this.maxHealth-1) * healthSpacing/2) + (i * healthSpacing) - 10,
                this.y + this.height/2 + 5,
                20,
                10
            );
            
            // Draw health block fill
            ctx.fillStyle = i < this.health ? '#00ff00' : '#333333';
            ctx.fillRect(
                this.x - ((this.maxHealth-1) * healthSpacing/2) + (i * healthSpacing) - 8,
                this.y + this.height/2 + 7,
                16,
                6
            );
        }

        ctx.restore();
    }

    getWeaponColor() {
        switch(this.weaponType) {
            case 'laser': return '#00ff00';
            case 'plasma': return '#ff00ff';
            case 'ion': return '#00ffff';
            case 'quantum': return '#ffff00';
            case 'nova': return '#ff6600';
            case 'pulse': return '#4444ff';
            case 'beam': return '#ff0000';
            case 'wave': return '#00ffaa';
            default: return '#ffffff';
        }
    }

    shoot() {
        const bullets = [];
        const baseY = this.y + this.height * 0.2;
        
        switch(this.weaponType) {
            case 'laser':
                // Standard laser pattern - rapid, straight shots
                if (this.weaponLevel === 1) {
                    bullets.push(new Bullet(this.x, baseY, 'laser'));
                } else if (this.weaponLevel === 2) {
                    bullets.push(
                        new Bullet(this.x - 10, baseY, 'laser'),
                        new Bullet(this.x + 10, baseY, 'laser')
                    );
                } else {
                    bullets.push(
                        new Bullet(this.x, baseY - 5, 'laser'),
                        new Bullet(this.x - 15, baseY, 'laser'),
                        new Bullet(this.x + 15, baseY, 'laser')
                    );
                }
                break;

            case 'plasma':
                // Spread shot pattern - wide coverage
                const spread = this.weaponLevel * 15;
                for (let i = 0; i < this.weaponLevel + 1; i++) {
                    const angle = (i - this.weaponLevel/2) * (spread/this.weaponLevel);
                    bullets.push(new Bullet(this.x, baseY, 'plasma', angle));
                }
                break;

            case 'ion':
                // Rapid fire pattern - quick, thin beams
                for (let i = 0; i < this.weaponLevel; i++) {
                    bullets.push(new Bullet(this.x, baseY - i * 5, 'ion'));
                }
                break;

            case 'quantum':
                // Quantum pattern - powerful penetrating shots
                if (this.weaponLevel === 1) {
                    bullets.push(new Bullet(this.x, baseY, 'quantum'));
                } else if (this.weaponLevel === 2) {
                    bullets.push(
                        new Bullet(this.x - 20, baseY, 'quantum'),
                        new Bullet(this.x + 20, baseY, 'quantum')
                    );
                } else {
                    bullets.push(
                        new Bullet(this.x, baseY, 'quantum'),
                        new Bullet(this.x - 25, baseY + 10, 'quantum'),
                        new Bullet(this.x + 25, baseY + 10, 'quantum')
                    );
                }
                break;

            case 'nova':
                // Nova pattern - radial burst
                const angles = this.weaponLevel * 8;
                for (let i = 0; i < angles; i++) {
                    const angle = (i * 360 / angles);
                    bullets.push(new Bullet(this.x, baseY, 'nova', angle));
                }
                break;

            case 'pulse':
                // Pulse pattern - oscillating waves
                for (let i = 0; i < this.weaponLevel + 2; i++) {
                    const offset = Math.sin(Date.now() / 200) * 20;
                    bullets.push(new Bullet(this.x + offset, baseY - i * 15, 'pulse'));
                }
                break;

            case 'beam':
                // Beam pattern - concentrated power
                const beamWidth = 5 + (this.weaponLevel * 3);
                for (let i = -beamWidth; i <= beamWidth; i += 5) {
                    bullets.push(new Bullet(this.x + i, baseY, 'beam'));
                }
                break;

            case 'wave':
                // Wave pattern - sinusoidal projectiles
                for (let i = 0; i < this.weaponLevel + 1; i++) {
                    const bullet = new Bullet(this.x, baseY, 'wave');
                    bullet.waveOffset = i * (Math.PI / 2);
                    bullet.waveAmplitude = 20;
                    bullet.waveFrequency = 0.1;
                    bullets.push(bullet);
                }
                break;
        }
        
        return bullets;
    }

    cycleWeapon() {
        const weapons = ['laser', 'plasma', 'ion', 'quantum', 'nova', 'pulse', 'beam', 'wave'];
        const currentIndex = weapons.indexOf(this.weaponType);
        this.weaponType = weapons[(currentIndex + 1) % weapons.length];
    }

    update(mouseX, mouseY) {
        // Update invulnerability timer
        if (this.invulnerableTime > 0) {
            this.invulnerableTime -= 16.67; // Assuming 60 FPS
        }

        this.x = Utils.clamp(mouseX, this.width/2, canvas.width - this.width/2);
        this.y = Utils.clamp(mouseY, 0, canvas.height - this.height);
    }

    takeDamage() {
        if (this.invulnerableTime > 0) return false;
        
        this.health--;
        this.invulnerableTime = this.invulnerableDuration;
        return this.health <= 0;
    }
}

// Enemy ship class
class Enemy {
    constructor() {
        this.width = 40;  // Wider to match reference style
        this.height = 60; // Taller to match reference style
        this.x = Utils.random(this.width, canvas.width - this.width);
        this.y = -this.height;
        this.speed = Utils.random(2, 4);
        // Use a darker color palette for enemy ships
        const colors = ['#6a0dad', '#800000', '#003366', '#4b0082', '#006400'];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        this.type = Math.floor(Math.random() * 3); // 0: Scout, 1: Fighter, 2: Bomber
        this.willDropPowerUp = Math.random() < 0.2; // 20% chance to drop power-up
        this.powerUpType = this.willDropPowerUp ? (Math.random() < 0.7 ? 'weapon' : 'bomb') : null; // 70% weapon, 30% bomb
        this.enginePulse = Math.random() * Math.PI * 2; // Random starting phase
        this.enginePulseSpeed = 0.1;
    }

    draw(ctx) {
        ctx.save();

        // Engine glow effect - shared by all ship types
        this.enginePulse = (this.enginePulse + this.enginePulseSpeed) % (Math.PI * 2);
        const engineGlowSize = 10 + Math.sin(this.enginePulse) * 2;
        
        const engineGradient = ctx.createRadialGradient(
            this.x, this.y - this.height/2,
            0,
            this.x, this.y - this.height/2,
            engineGlowSize
        );
        engineGradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
        engineGradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.4)');
        engineGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = engineGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y - this.height/2, engineGlowSize, 0, Math.PI * 2);
        ctx.fill();

        // Create metallic gradient for main ship body
        const bodyGradient = ctx.createLinearGradient(
            this.x - this.width/2, this.y,
            this.x + this.width/2, this.y
        );
        bodyGradient.addColorStop(0, this.baseColor);
        bodyGradient.addColorStop(0.5, this.lightenColor(this.baseColor, 30));
        bodyGradient.addColorStop(1, this.baseColor);
        ctx.fillStyle = bodyGradient;

        // Ship body based on type
        ctx.beginPath();
        
        switch(this.type) {
            case 0: // Scout - sleek and fast ship similar to reference but inverted
                // Main body
                ctx.moveTo(this.x, this.y + this.height/2); // Bottom point
                ctx.lineTo(this.x - this.width/4, this.y + this.height/4); // Lower left
                ctx.lineTo(this.x - this.width/3, this.y - this.height/6); // Mid left
                ctx.lineTo(this.x - this.width/6, this.y - this.height/2); // Upper left
                ctx.lineTo(this.x + this.width/6, this.y - this.height/2); // Upper right
                ctx.lineTo(this.x + this.width/3, this.y - this.height/6); // Mid right
                ctx.lineTo(this.x + this.width/4, this.y + this.height/4); // Lower right
                ctx.closePath();
                ctx.fill();
                
                // Wings
                const scoutWingGradient = ctx.createLinearGradient(
                    this.x - this.width/2, this.y,
                    this.x + this.width/2, this.y
                );
                scoutWingGradient.addColorStop(0, this.darkenColor(this.baseColor, 20));
                scoutWingGradient.addColorStop(0.5, this.baseColor);
                scoutWingGradient.addColorStop(1, this.darkenColor(this.baseColor, 20));
                ctx.fillStyle = scoutWingGradient;
                
                // Left wing
                ctx.beginPath();
                ctx.moveTo(this.x - this.width/3, this.y - this.height/6); // Wing root
                ctx.lineTo(this.x - this.width/2 - this.width/12, this.y - this.height/5); // Wing tip top
                ctx.lineTo(this.x - this.width/2 - this.width/12, this.y); // Wing tip bottom
                ctx.lineTo(this.x - this.width/3, this.y + this.height/8); // Wing root bottom
                ctx.closePath();
                ctx.fill();
                
                // Right wing
                ctx.beginPath();
                ctx.moveTo(this.x + this.width/3, this.y - this.height/6); // Wing root
                ctx.lineTo(this.x + this.width/2 + this.width/12, this.y - this.height/5); // Wing tip top
                ctx.lineTo(this.x + this.width/2 + this.width/12, this.y); // Wing tip bottom
                ctx.lineTo(this.x + this.width/3, this.y + this.height/8); // Wing root bottom
                ctx.closePath();
                ctx.fill();
                
                // Cockpit
                const cockpitGradient = ctx.createLinearGradient(
                    this.x, this.y,
                    this.x, this.y - this.height/3
                );
                cockpitGradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
                cockpitGradient.addColorStop(1, 'rgba(255, 100, 100, 0.4)');
                ctx.fillStyle = cockpitGradient;
                ctx.beginPath();
                ctx.ellipse(
                    this.x, this.y - this.height/6,
                    this.width/6, this.height/8,
                    0, 0, Math.PI * 2
                );
                ctx.fill();
                break;

            case 1: // Fighter - angular and aggressive
                // Main body
                ctx.moveTo(this.x, this.y + this.height/2); // Bottom point
                ctx.lineTo(this.x - this.width/5, this.y + this.height/4); // Lower left
                ctx.lineTo(this.x - this.width/2, this.y); // Middle left
                ctx.lineTo(this.x - this.width/4, this.y - this.height/4); // Upper left
                ctx.lineTo(this.x, this.y - this.height/2); // Top point
                ctx.lineTo(this.x + this.width/4, this.y - this.height/4); // Upper right
                ctx.lineTo(this.x + this.width/2, this.y); // Middle right
                ctx.lineTo(this.x + this.width/5, this.y + this.height/4); // Lower right
                ctx.closePath();
                ctx.fill();
                
                // Cockpit
                ctx.fillStyle = 'rgba(255, 50, 50, 0.6)';
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.height/6);
                ctx.lineTo(this.x - this.width/6, this.y);
                ctx.lineTo(this.x, this.y + this.height/8);
                ctx.lineTo(this.x + this.width/6, this.y);
                ctx.closePath();
                ctx.fill();
                
                // Detail lines
                ctx.strokeStyle = this.lightenColor(this.baseColor, 50);
                ctx.lineWidth = 1;
                ctx.beginPath();
                // Wing lines
                ctx.moveTo(this.x - this.width/4, this.y - this.height/6);
                ctx.lineTo(this.x - this.width/2, this.y);
                ctx.moveTo(this.x + this.width/4, this.y - this.height/6);
                ctx.lineTo(this.x + this.width/2, this.y);
                ctx.stroke();
                break;

            case 2: // Bomber - heavy and imposing
                // Main body - wider and blockier
                ctx.moveTo(this.x, this.y + this.height/2); // Bottom point
                ctx.lineTo(this.x - this.width/3, this.y + this.height/3); // Lower left
                ctx.lineTo(this.x - this.width/2, this.y); // Middle left
                ctx.lineTo(this.x - this.width/3, this.y - this.height/3); // Upper left
                ctx.lineTo(this.x, this.y - this.height/2); // Top point
                ctx.lineTo(this.x + this.width/3, this.y - this.height/3); // Upper right
                ctx.lineTo(this.x + this.width/2, this.y); // Middle right
                ctx.lineTo(this.x + this.width/3, this.y + this.height/3); // Lower right
                ctx.closePath();
                ctx.fill();
                
                // Heavy armor plating
                ctx.strokeStyle = this.darkenColor(this.baseColor, 30);
                ctx.lineWidth = 2;
                ctx.beginPath();
                // Horizontal armor lines
                for (let i = 1; i <= 3; i++) {
                    const y = this.y - this.height/3 + (this.height * i/5);
                    ctx.moveTo(this.x - this.width/3, y);
                    ctx.lineTo(this.x + this.width/3, y);
                }
                ctx.stroke();
                
                // Weapons pods
                ctx.fillStyle = this.darkenColor(this.baseColor, 20);
                [-1, 1].forEach(side => {
                    ctx.beginPath();
                    ctx.rect(
                        this.x + (side * this.width/3) - this.width/12,
                        this.y - this.height/8,
                        this.width/6,
                        this.height/4
                    );
                    ctx.fill();
                });
                
                // Center viewport
                const bomberCockpitGradient = ctx.createLinearGradient(
                    this.x, this.y - this.height/6,
                    this.x, this.y + this.height/6
                );
                bomberCockpitGradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
                bomberCockpitGradient.addColorStop(0.5, 'rgba(200, 0, 0, 0.5)');
                bomberCockpitGradient.addColorStop(1, 'rgba(150, 0, 0, 0.7)');
                ctx.fillStyle = bomberCockpitGradient;
                ctx.beginPath();
                ctx.rect(
                    this.x - this.width/8,
                    this.y - this.height/8,
                    this.width/4,
                    this.height/6
                );
                ctx.fill();
                break;
        }

        ctx.restore();
    }
    
    // Helper methods for color manipulation
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt,
              G = (num >> 8 & 0x00FF) + amt,
              B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) - amt,
              G = (num >> 8 & 0x00FF) - amt,
              B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }

    update() {
        // Different movement patterns based on type
        switch(this.type) {
            case 0: // Scout - faster, slight side-to-side movement
                this.x += Math.sin(this.y / 30) * 1;
                this.y += this.speed * 1.2;
                break;
            case 1: // Fighter - normal movement
                this.y += this.speed;
                break;
            case 2: // Bomber - slower but steadier
                this.y += this.speed * 0.8;
                break;
        }
        return this.y > canvas.height;
    }
}

// Boss class
class Boss {
    constructor(wave) {
        this.width = 150;
        this.height = this.width * 1.5;
        this.x = canvas.width / 2;
        this.y = 100;
        this.speed = 1 + (wave * 0.1);
        this.maxHealth = 500 + (wave * 100);
        this.health = this.maxHealth;
        this.color = '#800000'; // Dark red base color
        this.bullets = [];
        this.missiles = [];
        this.lastBulletTime = 0;
        this.bulletDelay = 500 - (wave * 20);
        this.lastMissileTime = 0;
        this.missileDelay = 3000 - (wave * 100);
        this.direction = 1; // 1 for right, -1 for left
        this.isInvulnerable = false;
        this.invulnerableTime = 0;
        this.invulnerableDuration = 1000;
        this.enginePulse = 0;
        this.enginePulseSpeed = 0.05;
        this.detailColor = '#ff9900'; // Orange accent color
    }

    draw(ctx) {
        ctx.save();

        // Draw missiles
        this.missiles.forEach(missile => missile.draw(ctx));
        
        // Engine glow effects
        this.enginePulse = (this.enginePulse + this.enginePulseSpeed) % 1;
        const engineGlowSize = 25 + Math.sin(this.enginePulse * Math.PI * 2) * 5;
        
        // Create multiple engine glows for the boss
        [-this.width/3, 0, this.width/3].forEach(offset => {
            const engineGradient = ctx.createRadialGradient(
                this.x + offset, this.y - this.height/2,
                0,
                this.x + offset, this.y - this.height/2,
                engineGlowSize
            );
            engineGradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)');
            engineGradient.addColorStop(0.5, 'rgba(255, 50, 0, 0.5)');
            engineGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = engineGradient;
            ctx.beginPath();
            ctx.arc(this.x + offset, this.y - this.height/2, engineGlowSize, 0, Math.PI * 2);
            ctx.fill();
        });

        // Main body gradient
        const bodyGradient = ctx.createLinearGradient(
            this.x - this.width/2, this.y,
            this.x + this.width/2, this.y
        );
        bodyGradient.addColorStop(0, this.lightenColor(this.color, 20));
        bodyGradient.addColorStop(0.5, this.color);
        bodyGradient.addColorStop(1, this.lightenColor(this.color, 20));
        
        // Draw boss ship - main hull in inverted orientation
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        
        // Main hull shape
        ctx.moveTo(this.x, this.y + this.height/2); // Bottom point
        ctx.lineTo(this.x - this.width/6, this.y + this.height/3); // Lower left curve
        ctx.lineTo(this.x - this.width/3, this.y + this.height/6); // Mid left
        ctx.lineTo(this.x - this.width/2, this.y); // Left wing joint
        ctx.lineTo(this.x - this.width/3, this.y - this.height/4); // Upper left
        ctx.lineTo(this.x - this.width/6, this.y - this.height/3); // Upper left curve
        ctx.lineTo(this.x, this.y - this.height/2); // Top point
        ctx.lineTo(this.x + this.width/6, this.y - this.height/3); // Upper right curve
        ctx.lineTo(this.x + this.width/3, this.y - this.height/4); // Upper right
        ctx.lineTo(this.x + this.width/2, this.y); // Right wing joint
        ctx.lineTo(this.x + this.width/3, this.y + this.height/6); // Mid right
        ctx.lineTo(this.x + this.width/6, this.y + this.height/3); // Lower right curve
        ctx.closePath();
        ctx.fill();
        
        // Wings
        const wingGradient = ctx.createLinearGradient(
            this.x - this.width, this.y,
            this.x + this.width, this.y
        );
        wingGradient.addColorStop(0, this.darkenColor(this.color, 10));
        wingGradient.addColorStop(0.5, this.color);
        wingGradient.addColorStop(1, this.darkenColor(this.color, 10));
        ctx.fillStyle = wingGradient;
        
        // Left wing
        ctx.beginPath();
        ctx.moveTo(this.x - this.width/3, this.y); // Wing root
        ctx.lineTo(this.x - this.width, this.y - this.height/8); // Wing tip top
        ctx.lineTo(this.x - this.width, this.y + this.height/8); // Wing tip bottom
        ctx.lineTo(this.x - this.width/3, this.y + this.height/6); // Wing root bottom
        ctx.closePath();
        ctx.fill();
        
        // Right wing
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/3, this.y); // Wing root
        ctx.lineTo(this.x + this.width, this.y - this.height/8); // Wing tip top
        ctx.lineTo(this.x + this.width, this.y + this.height/8); // Wing tip bottom
        ctx.lineTo(this.x + this.width/3, this.y + this.height/6); // Wing root bottom
        ctx.closePath();
        ctx.fill();
        
        // Cockpit/command center
        const cockpitGradient = ctx.createLinearGradient(
            this.x, this.y - this.height/6,
            this.x, this.y + this.height/10
        );
        cockpitGradient.addColorStop(0, 'rgba(255, 0, 0, 0.9)');
        cockpitGradient.addColorStop(0.5, 'rgba(255, 50, 50, 0.7)');
        cockpitGradient.addColorStop(1, 'rgba(150, 0, 0, 0.8)');
        ctx.fillStyle = cockpitGradient;
        ctx.beginPath();
        ctx.ellipse(
            this.x, this.y - this.height/8,
            this.width/6, this.height/8,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Draw missile launchers
        ctx.fillStyle = '#cc0000';
        [-1, 1].forEach(side => {
            ctx.fillRect(
                this.x + (side * this.width/3) - 10,
                this.y + this.height/8,
                20,
                this.height/5
            );
        });
        
        // Detail lines
        ctx.strokeStyle = this.detailColor; // Orange accent color
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Hull panel lines
        for (let i = 1; i <= 5; i++) {
            const y = this.y - this.height/3 + (this.height * i/8);
            ctx.moveTo(this.x - this.width/4, y);
            ctx.lineTo(this.x + this.width/4, y);
        }
        
        // Wing detail lines
        ctx.moveTo(this.x - this.width/3, this.y);
        ctx.lineTo(this.x - this.width * 0.8, this.y);
        ctx.moveTo(this.x + this.width/3, this.y);
        ctx.lineTo(this.x + this.width * 0.8, this.y);
        ctx.stroke();
        
        // Technical details - weapon pods and sensors
        ctx.fillStyle = '#aaa';
        // Top sensor array
        ctx.beginPath();
        ctx.rect(this.x - this.width/15, this.y - this.height/3, this.width/7.5, this.height/15);
        ctx.fill();

        // Draw health bar
        const healthBarWidth = this.width;
        const healthBarHeight = 10;
        const healthBarX = this.x - healthBarWidth/2;
        const healthBarY = this.y - this.height/2 - 20;

        ctx.fillStyle = '#333';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        ctx.fillStyle = '#00ff00';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * (this.health / this.maxHealth), healthBarHeight);

        // Draw invulnerability effect
        if (this.isInvulnerable) {
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            // Create shield effect around the boss
            ctx.ellipse(this.x, this.y, this.width * 0.7, this.height * 0.6, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }
    
    // Helper methods for color manipulation
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt,
              G = (num >> 8 & 0x00FF) + amt,
              B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) - amt,
              G = (num >> 8 & 0x00FF) - amt,
              B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
    }

    update(playerX, playerY) {
        // Move left and right
        this.x += this.direction * this.speed;
        
        // Reverse direction at screen edges
        if (this.x > canvas.width - this.width/2 || this.x < this.width/2) {
            this.direction *= -1;
        }
        
        // Update invulnerability
        if (this.isInvulnerable) {
            this.invulnerableTime -= 16.67; // Assuming 60 FPS
            if (this.invulnerableTime <= 0) {
                this.isInvulnerable = false;
            }
        }
        
        // Fire bullets
        const now = Date.now();
        if (now - this.lastBulletTime >= this.bulletDelay) {
            // Fire from multiple positions
            [-this.width/4, 0, this.width/4].forEach(offset => {
                // Calculate angle to player
                const dx = playerX - (this.x + offset);
                const dy = playerY - (this.y + this.height/4);
                const angle = Math.atan2(dy, dx);
                
                this.bullets.push(new BossBullet(
                    this.x + offset,
                    this.y + this.height/4,
                    angle
                ));
            });
            this.lastBulletTime = now;
        }
        
        // Fire missiles
        if (now - this.lastMissileTime >= this.missileDelay) {
            [-1, 1].forEach(side => {
                this.missiles.push(new Missile(
                    this.x + (side * this.width/3),
                    this.y + this.height/5,
                    playerX,
                    playerY
                ));
            });
            this.lastMissileTime = now;
        }
        
        // Update bullets
        this.bullets = this.bullets.filter(bullet => !bullet.update());
        
        // Update missiles
        this.missiles = this.missiles.filter(missile => !missile.update(playerX, playerY));
    }

    takeDamage(amount) {
        if (!this.isInvulnerable) {
            this.health -= amount;
            this.isInvulnerable = true;
            this.invulnerableTime = this.invulnerableDuration;
            return this.health <= 0;
        }
        return false;
    }
}

// Boss bullet class
class BossBullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.width = 6;
        this.height = 6;
        this.vx = Math.cos(angle) * 3;
        this.vy = Math.sin(angle) * 3;
        this.color = '#ff0000';
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width/2, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        return this.y > canvas.height || this.y < 0 || this.x < 0 || this.x > canvas.width;
    }
}

// Bullet class
class Bullet {
    constructor(x, y, type = 'laser', angle = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.angle = (angle * Math.PI) / 180; // Convert to radians
        this.waveOffset = 0;
        this.waveAmplitude = 0;
        this.waveFrequency = 0;
        this.setProperties();
    }

    setProperties() {
        switch(this.type) {
            case 'laser':
                this.width = 4;
                this.height = 12;
                this.speed = 8;
                this.color = '#00ff00';
                break;
            case 'plasma':
                this.width = 8;
                this.height = 8;
                this.speed = 6;
                this.color = '#ff00ff';
                break;
            case 'ion':
                this.width = 3;
                this.height = 15;
                this.speed = 10;
                this.color = '#00ffff';
                break;
            case 'quantum':
                this.width = 6;
                this.height = 20;
                this.speed = 7;
                this.color = '#ffff00';
                break;
            case 'nova':
                this.width = 6;
                this.height = 6;
                this.speed = 8;
                this.color = '#ff6600';
                break;
            case 'pulse':
                this.width = 5;
                this.height = 10;
                this.speed = 9;
                this.color = '#4444ff';
                break;
            case 'beam':
                this.width = 2;
                this.height = 25;
                this.speed = 12;
                this.color = '#ff0000';
                break;
            case 'wave':
                this.width = 4;
                this.height = 12;
                this.speed = 7;
                this.color = '#00ffaa';
                break;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = this.color;
        
        switch(this.type) {
            case 'laser':
                // Straight laser bolt
                ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
                break;
            case 'plasma':
                // Circular plasma ball with glow
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'ion':
                // Ion beam with glow
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 5;
                ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
                break;
            case 'quantum':
                // Quantum bolt with effects
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.moveTo(0, -this.height/2);
                ctx.lineTo(-this.width/2, this.height/2);
                ctx.lineTo(this.width/2, this.height/2);
                ctx.closePath();
                ctx.fill();
                break;
            case 'nova':
                // Nova burst with rotating effect
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
                ctx.fill();
                // Add rotating outer ring
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, this.width, Date.now() / 100, Date.now() / 100 + Math.PI);
                ctx.stroke();
                break;
            case 'pulse':
                // Pulse with ripple effect
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'rgba(68, 68, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(-this.width, -this.height/2, this.width * 2, this.height);
                break;
            case 'beam':
                // Concentrated beam with trail
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 20;
                ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
                // Add trailing effect
                const trailGradient = ctx.createLinearGradient(0, -this.height/2, 0, this.height/2);
                trailGradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
                trailGradient.addColorStop(0.5, this.color);
                trailGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                ctx.fillStyle = trailGradient;
                ctx.fillRect(-this.width * 2, -this.height/2, this.width * 4, this.height);
                break;
            case 'wave':
                // Wave projectile with oscillating trail
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.moveTo(-this.width/2, -this.height/2);
                for (let i = -this.height/2; i <= this.height/2; i++) {
                    const waveX = Math.sin((i + Date.now() * 0.1) * 0.1) * 3;
                    ctx.lineTo(-this.width/2 + waveX, i);
                }
                ctx.lineTo(this.width/2, this.height/2);
                ctx.lineTo(this.width/2, -this.height/2);
                ctx.closePath();
                ctx.fill();
                break;
        }
        
        ctx.restore();
    }

    update() {
        if (this.type === 'wave') {
            // Wave movement pattern
            this.y -= this.speed;
            this.x += Math.sin((this.y * this.waveFrequency) + this.waveOffset) * this.waveAmplitude * 0.1;
        } else {
            // Standard movement with angle
            const vx = Math.sin(this.angle) * this.speed;
            const vy = -Math.cos(this.angle) * this.speed;
            this.x += vx;
            this.y += vy;
        }
        return this.y + this.height < 0;
    }
}

// Explosion effect class
class Explosion {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];
        this.lifetime = 30;
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                size: 3
            });
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        for (const particle of this.particles) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    update() {
        for (const particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.size *= 0.95;
        }
        this.lifetime--;
        return this.lifetime <= 0;
    }
}

// Missile class for boss attacks
class Missile {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 16;
        this.speed = 4;
        this.color = '#ff4444';
        this.smokeParticles = [];
        this.targetX = targetX;
        this.targetY = targetY;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.acceleration = 1.02;
    }

    draw(ctx) {
        ctx.save();
        
        // Draw smoke trail
        ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        for (const particle of this.smokeParticles) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw missile
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);

        // Missile body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(0, -this.height/2);
        ctx.lineTo(-this.width/2, this.height/2);
        ctx.lineTo(this.width/2, this.height/2);
        ctx.closePath();
        ctx.fill();

        // Engine glow
        const gradient = ctx.createRadialGradient(0, this.height/2, 0, 0, this.height/2, this.width);
        gradient.addColorStop(0, 'rgba(255, 165, 0, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, this.height/2, this.width, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    update(playerX, playerY) {
        // Add smoke particle
        this.smokeParticles.push({
            x: this.x - Math.cos(this.angle) * this.height/2,
            y: this.y - Math.sin(this.angle) * this.height/2,
            size: 2,
            life: 1
        });

        // Update smoke particles
        this.smokeParticles = this.smokeParticles.filter(particle => {
            particle.size *= 0.95;
            particle.life -= 0.05;
            return particle.life > 0;
        });

        // Accelerate missile
        this.speed *= this.acceleration;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Check if out of bounds
        return this.y > canvas.height || this.y < 0 || this.x < 0 || this.x > canvas.width;
    }
}

// PowerUp class
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.type = type; // 'weapon', 'shield', or 'bomb'
        this.activeTime = 10000; // 10 seconds
        this.startTime = Date.now();
        this.color = this.getPowerUpColor();
        this.pulse = 0;
        this.pulseSpeed = 0.1;
    }

    getPowerUpColor() {
        switch(this.type) {
            case 'weapon': return '#ff00ff';
            case 'shield': return '#00ffff';
            case 'bomb': return '#ff6600';
            default: return '#ffffff';
        }
    }

    update() {
        this.y += this.speed;
        this.pulse = (this.pulse + this.pulseSpeed) % 1;
        
        // Check if power-up has expired
        if (Date.now() - this.startTime > this.activeTime) {
            return true; // Remove the power-up
        }
        
        return this.y > canvas.height; // Remove if off screen
    }

    draw(ctx) {
        ctx.save();
        
        // Draw pulsing glow
        const glowSize = 20 + Math.sin(this.pulse * Math.PI * 2) * 5;
        const glowGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, glowSize
        );
        glowGradient.addColorStop(0, `${this.color}80`);
        glowGradient.addColorStop(1, `${this.color}00`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw power-up symbol
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();

        // Draw type-specific symbol
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        if (this.type === 'bomb') {
            // Draw bomb symbol
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - 5);
            ctx.lineTo(this.x, this.y - 10);
            ctx.stroke();
        }

        // Draw remaining time indicator
        const timeLeft = Math.max(0, this.activeTime - (Date.now() - this.startTime));
        const timePercentage = timeLeft / this.activeTime;
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 12, -Math.PI/2, -Math.PI/2 + (2 * Math.PI * timePercentage));
        ctx.stroke();

        ctx.restore();
    }
} 