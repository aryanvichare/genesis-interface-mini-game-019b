import { useState, useEffect, useRef } from 'react';

type Game = {
  id: number;
  title: string;
  year: number;
  genre: string;
  color: string;
  description: string;
  cartridgeColor: string;
};

type MiniGameProps = {
  game: Game;
  onBack: () => void;
};

type Enemy = {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  health: number;
  type: 'normal' | 'chaser' | 'shooter' | 'bomber';
  shootCooldown: number;
};

type Projectile = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  enemyProjectile?: boolean;
};

type PowerUp = {
  id: number;
  x: number;
  y: number;
  type: 'speed' | 'rapid' | 'shield' | 'multiplier';
  color: string;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  tx: number;
  ty: number;
};

type PowerUpActive = {
  type: 'speed' | 'rapid' | 'shield' | 'multiplier';
  expires: number;
};

export default function MiniGame({ game, onBack }: MiniGameProps) {
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(50);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('genesis-highscore');
    return saved ? parseInt(saved) : 0;
  });
  const [lives, setLives] = useState(3);
  const [gameTime, setGameTime] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activePowerUps, setActivePowerUps] = useState<PowerUpActive[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerSpeed, setPlayerSpeed] = useState(3);
  const [fireRate, setFireRate] = useState(1); // shots per click
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [hasShield, setHasShield] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(0);
  const enemyIdRef = useRef(0);
  const projectileIdRef = useRef(0);
  const powerUpIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const lastShotTimeRef = useRef(0);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('genesis-highscore', score.toString());
    }
  }, [score, highScore]);

  // Initialize game
  useEffect(() => {
    if (gameOver || isPaused) return;

    // Create initial enemies
    const initialEnemies: Enemy[] = [];
    for (let i = 0; i < 5; i++) {
      enemyIdRef.current++;
      const enemyType = Math.random() < 0.7 ? 'normal' : 
                       Math.random() < 0.8 ? 'chaser' :
                       Math.random() < 0.9 ? 'shooter' : 'bomber';
      initialEnemies.push({
        id: enemyIdRef.current,
        x: Math.random() * 80 + 10,
        y: Math.random() * 40 + 10,
        speed: 0.5 + Math.random() * 1.5,
        size: enemyType === 'bomber' ? 35 : enemyType === 'chaser' ? 25 : 20 + Math.random() * 20,
        color: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 5)],
        health: enemyType === 'bomber' ? 5 : enemyType === 'chaser' ? 2 : 3,
        type: enemyType,
        shootCooldown: 0,
      });
    }
    setEnemies(initialEnemies);

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!isPaused && !gameOver && deltaTime < 100) {
        const dt = deltaTime / 16;
        
        // Update game time
        setGameTime(prev => prev + deltaTime / 1000);

        // Update active power-ups
        const now = Date.now();
        setActivePowerUps(prev => prev.filter(p => p.expires > now));
        
        // Reset power-up effects if expired
        const hasSpeed = activePowerUps.some(p => p.type === 'speed');
        const hasRapid = activePowerUps.some(p => p.type === 'rapid');
        const hasShieldActive = activePowerUps.some(p => p.type === 'shield');
        const hasMultiplier = activePowerUps.some(p => p.type === 'multiplier');
        
        setPlayerSpeed(hasSpeed ? 6 : 3);
        setFireRate(hasRapid ? 3 : 1);
        setHasShield(hasShieldActive);
        setScoreMultiplier(hasMultiplier ? 2 : 1);

        // Update enemies
        setEnemies(prev => prev.map(enemy => {
          let newX = enemy.x;
          let newY = enemy.y;
          let newShootCooldown = enemy.shootCooldown - dt;
          
          // Different behavior based on enemy type
          switch(enemy.type) {
            case 'normal':
              newX = enemy.x + enemy.speed * dt;
              if (newX > 95 || newX < 5) {
                newX = enemy.x;
                enemy.speed *= -1;
              }
              if (Math.random() < 0.02) {
                newY = enemy.y + (playerY - enemy.y) * 0.1;
              }
              break;
              
            case 'chaser':
              // Chase player
              const dx = playerX - enemy.x;
              const dy = playerY - enemy.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist > 0) {
                newX = enemy.x + (dx / dist) * enemy.speed * dt;
                newY = enemy.y + (dy / dist) * enemy.speed * dt;
              }
              break;
              
            case 'shooter':
              newX = enemy.x + enemy.speed * dt * 0.5;
              if (newX > 95 || newX < 5) {
                newX = enemy.x;
                enemy.speed *= -1;
              }
              // Shoot at player
              if (newShootCooldown <= 0 && Math.random() < 0.02) {
                newShootCooldown = 60; // 1 second cooldown
                const pdx = playerX - enemy.x;
                const pdy = playerY - enemy.y;
                const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
                if (pdist > 0) {
                  projectileIdRef.current++;
                  setProjectiles(prev => [...prev, {
                    id: projectileIdRef.current,
                    x: enemy.x,
                    y: enemy.y,
                    dx: (pdx / pdist) * 3,
                    dy: (pdy / pdist) * 3,
                    enemyProjectile: true,
                  }]);
                }
              }
              break;
              
            case 'bomber':
              newX = enemy.x + enemy.speed * dt * 0.3;
              if (newX > 95 || newX < 5) {
                newX = enemy.x;
                enemy.speed *= -1;
              }
              // Drop bombs
              if (newShootCooldown <= 0 && Math.random() < 0.01) {
                newShootCooldown = 90;
                projectileIdRef.current++;
                setProjectiles(prev => [...prev, {
                  id: projectileIdRef.current,
                  x: enemy.x,
                  y: enemy.y,
                  dx: 0,
                  dy: 4,
                  enemyProjectile: true,
                }]);
              }
              break;
          }
          
          // Keep within bounds
          if (newY > 80) newY = 80;
          if (newY < 10) newY = 10;
          if (newX > 95) newX = 95;
          if (newX < 5) newX = 5;
          
          return { ...enemy, x: newX, y: newY, shootCooldown: newShootCooldown };
        }));

        // Update projectiles
        setProjectiles(prev => {
          const updated = prev.map(proj => ({
            ...proj,
            x: proj.x + proj.dx * dt,
            y: proj.y + proj.dy * dt,
          })).filter(proj => proj.x >= 0 && proj.x <= 100 && proj.y >= 0 && proj.y <= 100);
          
          // Check collisions with enemies (player projectiles)
          updated.forEach(proj => {
            if (!proj.enemyProjectile) {
              setEnemies(currentEnemies => {
                return currentEnemies.filter(enemy => {
                  const dx = proj.x - enemy.x;
                  const dy = proj.y - enemy.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  
                  if (distance < enemy.size / 2) {
                    // Create explosion particles
                    createExplosion(enemy.x, enemy.y, enemy.color);
                    // Add score
                    const points = 100 * scoreMultiplier;
                    setScore(s => s + points);
                    return false; // Remove enemy
                  }
                  return true;
                });
              });
            }
          });
          
          return updated;
        });

        // Check player collisions with enemies
        setEnemies(currentEnemies => {
          const collided = currentEnemies.filter(enemy => {
            const dx = playerX - enemy.x;
            const dy = playerY - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (20 + enemy.size / 2) / 2;
          });
          
          if (collided.length > 0 && !hasShield) {
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 200);
            collided.forEach(enemy => createExplosion(enemy.x, enemy.y, enemy.color));
            
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameOver(true);
              }
              return newLives;
            });
            return currentEnemies.filter(enemy => !collided.includes(enemy));
          }
          return currentEnemies;
        });

        // Check player collisions with enemy projectiles
        setProjectiles(currentProjectiles => {
          const collided = currentProjectiles.filter(proj => {
            if (!proj.enemyProjectile) return false;
            const dx = playerX - proj.x;
            const dy = playerY - proj.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < 15;
          });
          
          if (collided.length > 0 && !hasShield) {
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 200);
            collided.forEach(proj => createExplosion(proj.x, proj.y, '#FF0000'));
            
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameOver(true);
              }
              return newLives;
            });
            return currentProjectiles.filter(proj => !collided.includes(proj));
          }
          return currentProjectiles;
        });

        // Check player collisions with power-ups
        setPowerUps(currentPowerUps => {
          const collected = currentPowerUps.filter(powerUp => {
            const dx = playerX - powerUp.x;
            const dy = playerY - powerUp.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < 20;
          });
          
          collected.forEach(powerUp => {
            createExplosion(powerUp.x, powerUp.y, powerUp.color);
            const expires = Date.now() + 10000; // 10 seconds
            setActivePowerUps(prev => [...prev, { type: powerUp.type, expires }]);
            
            // Visual feedback
            if (powerUp.type === 'shield') {
              setHasShield(true);
            }
          });
          
          return currentPowerUps.filter(powerUp => !collected.includes(powerUp));
        });

        // Spawn new enemies occasionally
        if (Math.random() < 0.01 && enemies.length < 15) {
          enemyIdRef.current++;
          const enemyType = Math.random() < 0.6 ? 'normal' : 
                           Math.random() < 0.8 ? 'chaser' :
                           Math.random() < 0.9 ? 'shooter' : 'bomber';
          setEnemies(prev => [...prev, {
            id: enemyIdRef.current,
            x: Math.random() * 80 + 10,
            y: Math.random() * 40 + 10,
            speed: 0.5 + Math.random() * 2,
            size: enemyType === 'bomber' ? 35 : enemyType === 'chaser' ? 25 : 15 + Math.random() * 25,
            color: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 5)],
            health: enemyType === 'bomber' ? 5 : enemyType === 'chaser' ? 2 : 2,
            type: enemyType,
            shootCooldown: 0,
          }]);
        }

        // Spawn power-ups occasionally
        if (Math.random() < 0.005 && powerUps.length < 3) {
          powerUpIdRef.current++;
          const types: ('speed' | 'rapid' | 'shield' | 'multiplier')[] = ['speed', 'rapid', 'shield', 'multiplier'];
          const type = types[Math.floor(Math.random() * types.length)];
          const colors = {
            speed: '#00FF00',
            rapid: '#FF00FF', 
            shield: '#00FFFF',
            multiplier: '#FFFF00'
          };
          setPowerUps(prev => [...prev, {
            id: powerUpIdRef.current,
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 10,
            type,
            color: colors[type],
          }]);
        }

        // Update particles
        setParticles(prev => prev.filter(() => {
          // Particles are removed by animation end
          return true;
        }));
      }

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, gameOver, playerX, playerY, enemies.length, powerUps.length, hasShield, scoreMultiplier]);

  // Create explosion particles
  const createExplosion = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      particleIdRef.current++;
      newParticles.push({
        id: particleIdRef.current,
        x,
        y,
        color,
        size: 3 + Math.random() * 5,
        tx: (Math.random() - 0.5) * 60,
        ty: (Math.random() - 0.5) * 60,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 600);
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      const speed = playerSpeed;
      switch(e.key) {
        case 'ArrowLeft':
          setPlayerX(prev => Math.max(10, prev - speed));
          break;
        case 'ArrowRight':
          setPlayerX(prev => Math.min(90, prev + speed));
          break;
        case 'ArrowUp':
          setPlayerY(prev => Math.max(10, prev - speed));
          break;
        case 'ArrowDown':
          setPlayerY(prev => Math.min(90, prev + speed));
          break;
        case ' ':
          // Shoot projectile(s)
          const now = Date.now();
          if (now - lastShotTimeRef.current > 200 / fireRate) {
            lastShotTimeRef.current = now;
            for (let i = 0; i < fireRate; i++) {
              projectileIdRef.current++;
              const spread = fireRate > 1 ? (i - (fireRate - 1) / 2) * 0.5 : 0;
              setProjectiles(prev => [...prev, {
                id: projectileIdRef.current,
                x: playerX,
                y: playerY,
                dx: spread,
                dy: -5,
              }]);
            }
          }
          break;
        case 'p':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerX, playerY, gameOver, playerSpeed, fireRate]);

  // Handle touch/mouse controls for game area
  const handleGameAreaClick = (e: React.MouseEvent) => {
    if (!gameAreaRef.current || gameOver) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPlayerX(Math.max(10, Math.min(90, x)));
    setPlayerY(Math.max(10, Math.min(90, y)));
    
    // Shoot toward click position
    const now = Date.now();
    if (now - lastShotTimeRef.current > 200 / fireRate) {
      lastShotTimeRef.current = now;
      for (let i = 0; i < fireRate; i++) {
        projectileIdRef.current++;
        const dx = (x - playerX) / 20;
        const dy = (y - playerY) / 20;
        const spread = fireRate > 1 ? (i - (fireRate - 1) / 2) * 0.1 : 0;
        setProjectiles(prev => [...prev, {
          id: projectileIdRef.current,
          x: playerX,
          y: playerY,
          dx: dx + spread,
          dy: dy,
        }]);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameTime(0);
    setEnemies([]);
    setProjectiles([]);
    setPowerUps([]);
    setParticles([]);
    setActivePowerUps([]);
    setGameOver(false);
    setPlayerX(50);
    setPlayerY(50);
    setPlayerSpeed(3);
    setFireRate(1);
    setScoreMultiplier(1);
    setHasShield(false);
    enemyIdRef.current = 0;
    projectileIdRef.current = 0;
    powerUpIdRef.current = 0;
    particleIdRef.current = 0;
  };

  return (
    <div className="h-full">
      {/* Screen Border */}
      <div className={`bg-gradient-to-b from-gray-900 to-black border-4 border-gray-800 rounded-xl p-1 shadow-2xl ${screenShake ? 'screen-shake' : ''}`}>
        {/* Screen Bezel */}
        <div className="bg-gradient-to-br from-gray-950 to-black border-2 border-gray-700 rounded-lg p-4">
          {/* Game Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 pb-4 border-b border-gray-800">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold tracking-wider text-white">{game.title}</h2>
              <p className="text-gray-400 text-sm">16-BIT ACTION GAME - BLAST PROCESSING ACTIVE</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg font-bold tracking-wider hover:from-amber-700 hover:to-amber-900 transition-all"
              >
                {isPaused ? 'RESUME' : 'PAUSE'}
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg font-bold tracking-wider hover:from-blue-700 hover:to-blue-900 transition-all"
              >
                EXIT GAME
              </button>
            </div>
          </div>
          
          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">SCORE</div>
              <div className="text-2xl font-bold text-green-400">{score.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">HIGH SCORE</div>
              <div className="text-2xl font-bold text-yellow-400">{highScore.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">LIVES</div>
              <div className="text-2xl font-bold text-red-400">
                {'♥'.repeat(lives)}
                <span className="text-gray-500">{'♥'.repeat(3 - lives)}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">TIME</div>
              <div className="text-2xl font-bold text-cyan-400">{Math.floor(gameTime)}s</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">ENEMIES</div>
              <div className="text-2xl font-bold text-yellow-400">{enemies.length}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">MULTIPLIER</div>
              <div className="text-2xl font-bold text-purple-400">x{scoreMultiplier}</div>
            </div>
          </div>
          
          {/* Active Power-ups */}
          {activePowerUps.length > 0 && (
            <div className="mb-4 p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {activePowerUps.map((powerUp, index) => {
                  const labels = {
                    speed: 'SPEED BOOST',
                    rapid: 'RAPID FIRE',
                    shield: 'SHIELD',
                    multiplier: '2x SCORE'
                  };
                  const colors = {
                    speed: 'text-green-400',
                    rapid: 'text-pink-400',
                    shield: 'text-cyan-400',
                    multiplier: 'text-yellow-400'
                  };
                  const timeLeft = Math.max(0, Math.ceil((powerUp.expires - Date.now()) / 1000));
                  return (
                    <div key={index} className={`px-3 py-1 rounded-full text-sm font-bold ${colors[powerUp.type]} bg-gray-800/70`}>
                      {labels[powerUp.type]} ({timeLeft}s)
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Game Area */}
          <div className="relative mb-6">
            <div 
              ref={gameAreaRef}
              onClick={handleGameAreaClick}
              className="relative h-96 w-full bg-gradient-to-br from-gray-950 to-black border-4 border-gray-800 rounded-lg overflow-hidden cursor-crosshair"
            >
              {/* Game grid background */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `
                  linear-gradient(rgba(100, 100, 255, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(100, 100, 255, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}></div>
              
              {/* Particles */}
              {particles.map(particle => (
                <div
                  key={particle.id}
                  className="particle"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    backgroundColor: particle.color,
                    transform: 'translate(-50%, -50%)',
                    '--tx': `${particle.tx}px`,
                    '--ty': `${particle.ty}px`,
                  } as React.CSSProperties}
                ></div>
              ))}
              
              {/* Power-ups */}
              {powerUps.map(powerUp => (
                <div
                  key={powerUp.id}
                  className="absolute powerup-glow rounded-lg border-2 border-white/50"
                  style={{
                    left: `${powerUp.x}%`,
                    top: `${powerUp.y}%`,
                    width: '24px',
                    height: '24px',
                    backgroundColor: powerUp.color,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="absolute inset-0 rounded-lg bg-white/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                    {powerUp.type === 'speed' && 'S'}
                    {powerUp.type === 'rapid' && 'R'}
                    {powerUp.type === 'shield' && 'D'}
                    {powerUp.type === 'multiplier' && '2x'}
                  </div>
                </div>
              ))}
              
              {/* Enemies */}
              {enemies.map(enemy => (
                <div
                  key={enemy.id}
                  className="absolute rounded-full border-2 border-white/50 transition-all duration-100"
                  style={{
                    left: `${enemy.x}%`,
                    top: `${enemy.y}%`,
                    width: `${enemy.size}px`,
                    height: `${enemy.size}px`,
                    backgroundColor: enemy.color,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: `0 0 10px ${enemy.color}`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: enemy.color }}></div>
                  {enemy.type !== 'normal' && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <span className="text-[8px] font-bold text-black">
                        {enemy.type === 'chaser' && 'C'}
                        {enemy.type === 'shooter' && 'S'}
                        {enemy.type === 'bomber' && 'B'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Projectiles */}
              {projectiles.map(proj => (
                <div
                  key={proj.id}
                  className={`absolute w-2 h-2 rounded-full ${proj.enemyProjectile ? 'bg-red-500' : 'bg-cyan-400'}`}
                  style={{
                    left: `${proj.x}%`,
                    top: `${proj.y}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: proj.enemyProjectile ? '0 0 8px #FF0000' : '0 0 8px #00FFFF',
                  }}
                ></div>
              ))}
              
              {/* Player */}
              <div
                className={`absolute w-10 h-10 rounded-lg border-2 ${hasShield ? 'border-cyan-400 shield-effect' : 'border-white'} transition-all duration-100`}
                style={{
                  left: `${playerX}%`,
                  top: `${playerY}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  boxShadow: hasShield ? '0 0 20px #00FFFF, 0 0 15px #3B82F6' : '0 0 15px #3B82F6',
                }}
              >
                <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-purple-400 rounded-md"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                {hasShield && (
                  <div className="absolute -inset-3 rounded-full border-2 border-cyan-400/50"></div>
                )}
              </div>
              
              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center p-8 bg-gradient-to-br from-gray-900 to-black border-4 border-gray-800 rounded-xl max-w-md">
                    <h3 className="text-3xl font-bold text-red-500 mb-4">GAME OVER</h3>
                    <div className="text-5xl font-bold text-white mb-2">{score.toLocaleString()}</div>
                    <p className="text-gray-300 mb-2">FINAL SCORE</p>
                    {score === highScore && (
                      <div className="text-yellow-400 font-bold mb-4">NEW HIGH SCORE!</div>
                    )}
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={resetGame}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg font-bold tracking-wider hover:from-green-700 hover:to-green-900 transition-all"
                      >
                        PLAY AGAIN
                      </button>
                      <button
                        onClick={onBack}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg font-bold tracking-wider hover:from-blue-700 hover:to-blue-900 transition-all"
                      >
                        MAIN MENU
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Pause Overlay */}
              {isPaused && !gameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center p-8 bg-gradient-to-br from-gray-900 to-black border-4 border-gray-800 rounded-xl">
                    <h3 className="text-3xl font-bold text-amber-500 mb-4">GAME PAUSED</h3>
                    <p className="text-gray-300 mb-6">Press P to resume or click button below</p>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg font-bold tracking-wider hover:from-amber-700 hover:to-amber-900 transition-all"
                    >
                      RESUME GAME
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Game Area Border Label */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-900 px-6 py-1 border border-gray-700 rounded">
              <span className="text-xs font-bold tracking-widest text-gray-400">16-BIT ACTION ARENA • BLAST PROCESSING ACTIVE</span>
            </div>
          </div>
          
          {/* Controls and Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-bold mb-3 text-cyan-300">CONTROLS & POWER-UPS</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded flex items-center justify-center mr-3">
                    <span className="font-bold">↑↓←→</span>
                  </div>
                  <span className="text-gray-300">Move Player</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded flex items-center justify-center mr-3">
                    <span className="font-bold">SPACE</span>
                  </div>
                  <span className="text-gray-300">Shoot</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded flex items-center justify-center mr-3">
                    <span className="font-bold">CLICK</span>
                  </div>
                  <span className="text-gray-300">Move & Shoot</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-800 border border-gray-700 rounded flex items-center justify-center mr-3">
                    <span className="font-bold">P</span>
                  </div>
                  <span className="text-gray-300">Pause</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="flex items-center p-2 bg-gray-800/30 rounded">
                  <div className="w-6 h-6 rounded bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-300">Speed Boost</span>
                </div>
                <div className="flex items-center p-2 bg-gray-800/30 rounded">
                  <div className="w-6 h-6 rounded bg-pink-500 mr-2"></div>
                  <span className="text-sm text-gray-300">Rapid Fire</span>
                </div>
                <div className="flex items-center p-2 bg-gray-800/30 rounded">
                  <div className="w-6 h-6 rounded bg-cyan-500 mr-2"></div>
                  <span className="text-sm text-gray-300">Shield</span>
                </div>
                <div className="flex items-center p-2 bg-gray-800/30 rounded">
                  <div className="w-6 h-6 rounded bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-300">2x Score</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-bold mb-3 text-red-300">ENEMY TYPES</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span><span className="font-bold">Normal:</span> Moves horizontally</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                  <span><span className="font-bold">Chaser:</span> Pursues player</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span><span className="font-bold">Shooter:</span> Fires projectiles</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                  <span><span className="font-bold">Bomber:</span> Drops bombs</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-gray-950/50 rounded border border-gray-700">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-gray-400">BLAST PROCESSING: {Math.floor(score / 100) * 10}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}