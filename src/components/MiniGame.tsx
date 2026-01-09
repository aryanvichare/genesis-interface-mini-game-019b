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
};

type Projectile = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
};

export default function MiniGame({ game, onBack }: MiniGameProps) {
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(50);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameTime, setGameTime] = useState(0);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(0);
  const enemyIdRef = useRef(0);
  const projectileIdRef = useRef(0);

  // Initialize game
  useEffect(() => {
    if (gameOver || isPaused) return;

    // Create initial enemies
    const initialEnemies: Enemy[] = [];
    for (let i = 0; i < 5; i++) {
      enemyIdRef.current++;
      initialEnemies.push({
        id: enemyIdRef.current,
        x: Math.random() * 80 + 10,
        y: Math.random() * 40 + 10,
        speed: 0.5 + Math.random() * 1.5,
        size: 20 + Math.random() * 20,
        color: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 5)],
        health: 3,
      });
    }
    setEnemies(initialEnemies);

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!isPaused && !gameOver && deltaTime < 100) {
        // Update game time
        setGameTime(prev => prev + deltaTime / 1000);

        // Update enemies
        setEnemies(prev => prev.map(enemy => {
          let newX = enemy.x + enemy.speed * (deltaTime / 16);
          let newY = enemy.y;
          
          // Bounce off walls
          if (newX > 95 || newX < 5) {
            newX = enemy.x;
            enemy.speed *= -1;
          }
          
          // Move toward player
          if (Math.random() < 0.02) {
            newY = enemy.y + (playerY - enemy.y) * 0.1;
          }
          
          // Keep within bounds
          if (newY > 80) newY = 80;
          if (newY < 10) newY = 10;
          
          return { ...enemy, x: newX, y: newY };
        }));

        // Update projectiles
        setProjectiles(prev => {
          const updated = prev.map(proj => ({
            ...proj,
            x: proj.x + proj.dx * (deltaTime / 16),
            y: proj.y + proj.dy * (deltaTime / 16),
          })).filter(proj => proj.x >= 0 && proj.x <= 100 && proj.y >= 0 && proj.y <= 100);
          
          // Check collisions
          updated.forEach(proj => {
            setEnemies(currentEnemies => {
              return currentEnemies.filter(enemy => {
                const dx = proj.x - enemy.x;
                const dy = proj.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < enemy.size / 2) {
                  setScore(s => s + 100);
                  return false; // Remove enemy
                }
                return true;
              });
            });
          });
          
          return updated;
        });

        // Check player collisions
        setEnemies(currentEnemies => {
          const collided = currentEnemies.filter(enemy => {
            const dx = playerX - enemy.x;
            const dy = playerY - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < (20 + enemy.size / 2) / 2;
          });
          
          if (collided.length > 0) {
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

        // Spawn new enemies occasionally
        if (Math.random() < 0.01 && enemies.length < 15) {
          enemyIdRef.current++;
          setEnemies(prev => [...prev, {
            id: enemyIdRef.current,
            x: Math.random() * 80 + 10,
            y: Math.random() * 40 + 10,
            speed: 0.5 + Math.random() * 2,
            size: 15 + Math.random() * 25,
            color: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'][Math.floor(Math.random() * 5)],
            health: 2,
          }]);
        }
      }

      requestAnimationFrame(gameLoop);
    };

    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, gameOver, playerX, playerY, enemies.length]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      const speed = 3;
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
          // Shoot projectile
          projectileIdRef.current++;
          setProjectiles(prev => [...prev, {
            id: projectileIdRef.current,
            x: playerX,
            y: playerY,
            dx: 0,
            dy: -5,
          }]);
          break;
        case 'p':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerX, playerY, gameOver]);

  // Handle touch/mouse controls for game area
  const handleGameAreaClick = (e: React.MouseEvent) => {
    if (!gameAreaRef.current || gameOver) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPlayerX(Math.max(10, Math.min(90, x)));
    setPlayerY(Math.max(10, Math.min(90, y)));
    
    // Shoot toward click position
    projectileIdRef.current++;
    const dx = (x - playerX) / 20;
    const dy = (y - playerY) / 20;
    setProjectiles(prev => [...prev, {
      id: projectileIdRef.current,
      x: playerX,
      y: playerY,
      dx,
      dy,
    }]);
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameTime(0);
    setEnemies([]);
    setProjectiles([]);
    setGameOver(false);
    setPlayerX(50);
    setPlayerY(50);
    enemyIdRef.current = 0;
    projectileIdRef.current = 0;
  };

  return (
    <div className="h-full">
      {/* Screen Border */}
      <div className="bg-gradient-to-b from-gray-900 to-black border-4 border-gray-800 rounded-xl p-1 shadow-2xl">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">SCORE</div>
              <div className="text-3xl font-bold text-green-400">{score.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">LIVES</div>
              <div className="text-3xl font-bold text-red-400">
                {'♥'.repeat(lives)}
                <span className="text-gray-500">{'♥'.repeat(3 - lives)}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">TIME</div>
              <div className="text-3xl font-bold text-cyan-400">{Math.floor(gameTime)}s</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">ENEMIES</div>
              <div className="text-3xl font-bold text-yellow-400">{enemies.length}</div>
            </div>
          </div>
          
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
                </div>
              ))}
              
              {/* Projectiles */}
              {projectiles.map(proj => (
                <div
                  key={proj.id}
                  className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                  style={{
                    left: `${proj.x}%`,
                    top: `${proj.y}%`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 8px #00FFFF',
                  }}
                ></div>
              ))}
              
              {/* Player */}
              <div
                className="absolute w-10 h-10 rounded-lg border-2 border-white transition-all duration-100"
                style={{
                  left: `${playerX}%`,
                  top: `${playerY}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                  boxShadow: '0 0 15px #3B82F6',
                }}
              >
                <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-purple-400 rounded-md"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              
              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center p-8 bg-gradient-to-br from-gray-900 to-black border-4 border-gray-800 rounded-xl max-w-md">
                    <h3 className="text-3xl font-bold text-red-500 mb-4">GAME OVER</h3>
                    <div className="text-5xl font-bold text-white mb-4">{score.toLocaleString()}</div>
                    <p className="text-gray-300 mb-6">FINAL SCORE</p>
                    <button
                      onClick={resetGame}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg font-bold tracking-wider hover:from-green-700 hover:to-green-900 transition-all"
                    >
                      PLAY AGAIN
                    </button>
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
              <span className="text-xs font-bold tracking-widest text-gray-400">16-BIT ACTION ARENA</span>
            </div>
          </div>
          
          {/* Controls Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-bold mb-3 text-cyan-300">CONTROLS</h4>
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
                  <span className="text-gray-300">Shoot Up</span>
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
                  <span className="text-gray-300">Pause Game</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-lg p-4">
              <h4 className="text-lg font-bold mb-3 text-red-300">OBJECTIVE</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                  <span>Avoid enemy collisions</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-cyan-500 rounded-full mr-2"></div>
                  <span>Shoot enemies to score points</span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span>Survive as long as possible</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-gray-950/50 rounded border border-gray-700">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm text-gray-400">BLAST PROCESSING: {Math.floor(score / 1000) * 10}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}