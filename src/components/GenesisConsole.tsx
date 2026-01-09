import { cn } from '../utils/cn';

type Game = {
  id: number;
  title: string;
  year: number;
  genre: string;
  color: string;
  description: string;
  cartridgeColor: string;
};

type GenesisConsoleProps = {
  cartridgeInserted: boolean;
  selectedGame: Game;
  onEject: () => void;
  onPowerToggle: () => void;
  powerOn: boolean;
};

export default function GenesisConsole({ cartridgeInserted, selectedGame, onEject, onPowerToggle, powerOn }: GenesisConsoleProps) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-2 border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 text-cyan-300 tracking-wider">SEGA GENESIS CONSOLE</h2>
      
      {/* Console Body */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-700">
        {/* Console Top */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          {/* Sega Logo */}
          <div className="mb-6 md:mb-0">
            <div className="w-24 h-12 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl tracking-widest">SEGA</span>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-gray-400 tracking-widest">GENESIS</span>
            </div>
          </div>
          
          {/* Power LED */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-10 h-10 rounded-full border-2 border-gray-700 mb-2 flex items-center justify-center",
              powerOn ? "bg-gradient-to-br from-green-500 to-green-700 animate-pulse" : "bg-gradient-to-br from-gray-700 to-gray-900"
            )}>
              {powerOn && (
                <div className="w-6 h-6 rounded-full bg-green-300/50 animate-ping"></div>
              )}
            </div>
            <button
              onClick={onPowerToggle}
              className={cn(
                "px-4 py-2 rounded text-sm font-bold tracking-wider transition-all",
                powerOn 
                  ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900" 
                  : "bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900"
              )}
            >
              POWER
            </button>
          </div>
        </div>
        
        {/* Console Front Panel */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg p-6 border border-gray-700 mb-6">
          {/* Cartridge Status */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={cn(
                "w-4 h-4 rounded-full mr-3",
                cartridgeInserted ? "bg-green-500 animate-pulse" : "bg-red-500"
              )}></div>
              <span className="text-gray-300">CARTRIDGE</span>
            </div>
            <span className={cn(
              "font-bold",
              cartridgeInserted ? "text-green-400" : "text-red-400"
            )}>
              {cartridgeInserted ? "INSERTED" : "EMPTY"}
            </span>
          </div>
          
          {/* Inserted Game Info */}
          {cartridgeInserted && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded border border-gray-700">
              <div className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-lg mr-3 flex items-center justify-center",
                  selectedGame.cartridgeColor
                )}>
                  <span className="font-bold text-white">{selectedGame.id}</span>
                </div>
                <div className="flex-1">
                  <div className="font-bold truncate">{selectedGame.title}</div>
                  <div className="text-sm text-gray-400">{selectedGame.year} • {selectedGame.genre}</div>
                </div>
                <button
                  onClick={onEject}
                  className="px-3 py-1 bg-gradient-to-r from-red-700 to-red-900 rounded text-sm font-bold hover:from-red-800 hover:to-red-950 transition-all"
                >
                  EJECT
                </button>
              </div>
            </div>
          )}
          
          {/* Console Ports */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="w-12 h-6 bg-gray-900 border border-gray-700 rounded mx-auto mb-1"></div>
              <span className="text-xs text-gray-500">CONTROLLER 1</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-6 bg-gray-900 border border-gray-700 rounded mx-auto mb-1"></div>
              <span className="text-xs text-gray-500">CONTROLLER 2</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-6 bg-gray-900 border border-gray-700 rounded mx-auto mb-1"></div>
              <span className="text-xs text-gray-500">EXTENSION</span>
            </div>
          </div>
        </div>
        
        {/* Console Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-2 border-gray-600 mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold">RESET</span>
            </div>
            <span className="text-xs text-gray-500">RESET</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full border-2 border-blue-600 mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold">START</span>
            </div>
            <span className="text-xs text-gray-500">START</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-red-900 rounded-full border-2 border-red-600 mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold">MODE</span>
            </div>
            <span className="text-xs text-gray-500">MODE</span>
          </div>
        </div>
        
        {/* Console Vent */}
        <div className="bg-gradient-to-b from-gray-950 to-black rounded-lg p-4 border border-gray-800">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded"></div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="text-xs text-gray-600">COOLING VENT • BLAST PROCESSING</span>
          </div>
        </div>
      </div>
      
      {/* Console Specs */}
      <div className="mt-6 p-4 bg-gray-950/50 border border-gray-800 rounded-lg">
        <h3 className="text-lg font-bold mb-3 text-amber-300">CONSOLE SPECIFICATIONS</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">CPU:</span>
            <span className="font-bold text-cyan-300">Motorola 68000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">CLOCK SPEED:</span>
            <span className="font-bold">7.67 MHz</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">MEMORY:</span>
            <span className="font-bold">64 KB</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">COLORS:</span>
            <span className="font-bold">512</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">RESOLUTION:</span>
            <span className="font-bold">320×224</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">SOUND:</span>
            <span className="font-bold">YM2612 + SN76489</span>
          </div>
        </div>
      </div>
    </div>
  );
}