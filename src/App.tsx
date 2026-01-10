import { useState, useEffect, useRef } from 'react';
import { cn } from './utils/cn';
import GameCartridgeSlot from './components/GameCartridgeSlot';
import GameSelectScreen from './components/GameSelectScreen';
import MiniGame from './components/MiniGame';
import GenesisConsole from './components/GenesisConsole';
import BlastBackground from './components/BlastBackground';

type Game = {
  id: number;
  title: string;
  year: number;
  genre: string;
  color: string;
  description: string;
  cartridgeColor: string;
};

const GAMES: Game[] = [
  { id: 1, title: 'SONIC THE HEDGEHOG', year: 1991, genre: 'Platformer', color: 'bg-blue-600', description: 'Blaze through loops at supersonic speed', cartridgeColor: 'bg-gradient-to-br from-blue-700 to-cyan-500' },
  { id: 2, title: 'STREETS OF RAGE', year: 1991, genre: 'Beat \'em Up', color: 'bg-red-600', description: 'Clean up the streets with fists of justice', cartridgeColor: 'bg-gradient-to-br from-red-700 to-orange-600' },
  { id: 3, title: 'GOLDEN AXE', year: 1989, genre: 'Hack & Slash', color: 'bg-amber-700', description: 'Battle fantasy beasts with magic and steel', cartridgeColor: 'bg-gradient-to-br from-amber-800 to-yellow-700' },
  { id: 4, title: 'MORTAL KOMBAT', year: 1993, genre: 'Fighting', color: 'bg-purple-700', description: 'Finish them with brutal fatalities', cartridgeColor: 'bg-gradient-to-br from-purple-800 to-pink-700' },
  { id: 5, title: 'EARTHWORM JIM', year: 1994, genre: 'Run & Gun', color: 'bg-green-700', description: 'A worm in a super suit saves the galaxy', cartridgeColor: 'bg-gradient-to-br from-green-800 to-emerald-600' },
  { id: 6, title: 'COMIX ZONE', year: 1995, genre: 'Action', color: 'bg-rose-700', description: 'Fight through comic book panels', cartridgeColor: 'bg-gradient-to-br from-rose-800 to-red-600' },
];

function App() {
  const [selectedGame, setSelectedGame] = useState<Game>(GAMES[0]);
  const [cartridgeInserted, setCartridgeInserted] = useState(false);
  const [powerOn, setPowerOn] = useState(true);
  const [screenMode, setScreenMode] = useState<'select' | 'game'>('select');
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleCartridgeInsert = (game: Game) => {
    setSelectedGame(game);
    setCartridgeInserted(true);
    // Play insertion sound if audio is available
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const handleCartridgeEject = () => {
    setCartridgeInserted(false);
    setScreenMode('select');
  };

  const handlePowerToggle = () => {
    setPowerOn(!powerOn);
  };

  const handleStartGame = () => {
    if (cartridgeInserted) {
      setScreenMode('game');
    }
  };

  const handleBackToSelect = () => {
    setScreenMode('select');
  };

  // Scanlines effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (scanlinesEnabled) {
        // Subtle scanline effect
        const scanline = document.querySelector('.scanline');
        if (scanline) {
          scanline.classList.toggle('opacity-30');
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [scanlinesEnabled]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-x-hidden">
      {/* Hidden audio element for cartridge insertion sound */}
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-retro-game-emergency-alarm-1000.mp3" preload="auto" />
      
      {/* CRT Screen overlay for authentic 16-bit feel */}
      {scanlinesEnabled && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-5"></div>
          <div className="absolute inset-0 scanline opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.2) 2px, rgba(0, 0, 0, 0.2) 4px)'
          }}></div>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.3) 100%)'
          }}></div>
        </div>
      )}

      {/* Blast Processing Background Effect */}
      <BlastBackground powerOn={powerOn} />

      {/* Header with Sega Genesis branding */}
      <header className="p-6 border-b-2 border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center font-bold text-2xl">
              SEGA
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wider text-white">GENESIS</h1>
              <p className="text-gray-400 text-sm tracking-widest">16-BIT CONSOLE INTERFACE</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">BLAST PROCESSING</span>
              <div className={cn("w-3 h-3 rounded-full animate-pulse", powerOn ? "bg-green-500" : "bg-red-500")}></div>
            </div>
            
            <button 
              onClick={handlePowerToggle}
              className={cn(
                "px-4 py-2 rounded font-bold tracking-wider transition-all",
                powerOn 
                  ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900" 
                  : "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
              )}
            >
              {powerOn ? "POWER OFF" : "POWER ON"}
            </button>
            
            <button 
              onClick={() => setScanlinesEnabled(!scanlinesEnabled)}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded font-bold tracking-wider hover:from-gray-700 hover:to-gray-800 transition-all"
            >
              {scanlinesEnabled ? "CRT OFF" : "CRT ON"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {powerOn ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Cartridge Slot and Console */}
            <div className="lg:col-span-1 space-y-8">
              <GenesisConsole 
                cartridgeInserted={cartridgeInserted}
                selectedGame={selectedGame}
                onEject={handleCartridgeEject}
                onPowerToggle={handlePowerToggle}
                powerOn={powerOn}
              />
              
              <GameCartridgeSlot 
                games={GAMES}
                onCartridgeInsert={handleCartridgeInsert}
                cartridgeInserted={cartridgeInserted}
                selectedGame={selectedGame}
              />
              
              {/* Console Controls */}
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-2 border-gray-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-cyan-300 tracking-wider">CONTROLS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleStartGame}
                    disabled={!cartridgeInserted}
                    className={cn(
                      "py-3 rounded-lg font-bold tracking-wider transition-all",
                      cartridgeInserted 
                        ? "bg-gradient-to-r from-green-600 to-emerald-800 hover:from-green-700 hover:to-emerald-900" 
                        : "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    START GAME
                  </button>
                  <button 
                    onClick={handleBackToSelect}
                    className="py-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg font-bold tracking-wider hover:from-blue-700 hover:to-blue-900 transition-all"
                  >
                    GAME SELECT
                  </button>
                  <button className="py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg font-bold tracking-wider hover:from-purple-700 hover:to-purple-900 transition-all">
                    RESET
                  </button>
                  <button className="py-3 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg font-bold tracking-wider hover:from-amber-700 hover:to-amber-900 transition-all">
                    SAVE STATE
                  </button>
                </div>
                
                {/* Status Display */}
                <div className="mt-6 p-4 bg-gray-950 border border-gray-800 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">STATUS:</span>
                    <span className={cn("font-bold", cartridgeInserted ? "text-green-400" : "text-red-400")}>
                      {cartridgeInserted ? "CARTRIDGE INSERTED" : "NO CARTRIDGE"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">MODE:</span>
                    <span className="font-bold text-cyan-300">{screenMode.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">PROCESSING:</span>
                    <span className="font-bold text-red-400 animate-pulse">BLAST ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Game Screen */}
            <div className="lg:col-span-2">
              {screenMode === 'select' ? (
                <GameSelectScreen 
                  games={GAMES}
                  selectedGame={selectedGame}
                  onSelectGame={setSelectedGame}
                  cartridgeInserted={cartridgeInserted}
                />
              ) : (
                <MiniGame 
                  game={selectedGame}
                  onBack={handleBackToSelect}
                />
              )}
            </div>
          </div>
        ) : (
          /* Power Off Screen */
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-32 h-32 mb-8 bg-gradient-to-br from-gray-900 to-black border-8 border-gray-800 rounded-full flex items-center justify-center">
              <div className="w-20 h-20 bg-gray-900 rounded-full border-4 border-gray-800"></div>
            </div>
            <h2 className="text-4xl font-bold tracking-wider text-gray-600 mb-4">POWER OFF</h2>
            <p className="text-gray-500 text-lg">Press POWER ON to activate the console</p>
            <div className="mt-8 flex space-x-4">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Blast Processing Footer */}
        <div className="mt-12 p-6 bg-gradient-to-r from-gray-900 to-black border-t-2 border-gray-800 rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-red-400 tracking-wider">BLAST PROCESSING ACTIVE</h3>
              <p className="text-gray-400">Sega Genesis 16-bit architecture delivering unparalleled speed</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-2 h-8 bg-gradient-to-t from-cyan-500 to-blue-700 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
              <span className="text-cyan-300 font-bold tracking-widest">68000 CPU</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 border-t-2 border-gray-800 text-center text-gray-500 text-sm">
        <p>SEGA GENESIS CONSOLE INTERFACE • 16-BIT EMULATION • BLAST PROCESSING TECHNOLOGY</p>
        <p className="mt-2">© 1990-1994 SEGA • THIS IS A FAN-MADE INTERFACE FOR DEMONSTRATION PURPOSES</p>
      </footer>
    </div>
  );
}

export default App;