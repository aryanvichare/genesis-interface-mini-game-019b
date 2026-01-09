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

type GameCartridgeSlotProps = {
  games: Game[];
  onCartridgeInsert: (game: Game) => void;
  cartridgeInserted: boolean;
  selectedGame: Game;
};

export default function GameCartridgeSlot({ games, onCartridgeInsert, cartridgeInserted, selectedGame }: GameCartridgeSlotProps) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-2 border-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4 text-cyan-300 tracking-wider">CARTRIDGE SLOT</h2>
      
      {/* Cartridge Slot Visual */}
      <div className="relative mb-8">
        {/* Slot opening */}
        <div className="h-32 bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-gray-700 rounded-lg relative overflow-hidden">
          {/* Slot interior */}
          <div className="absolute inset-2 bg-gradient-to-b from-black to-gray-900 rounded"></div>
          
          {/* Inserted cartridge visual */}
          {cartridgeInserted && (
            <div className={cn(
              "absolute top-2 left-2 right-2 h-28 rounded",
              selectedGame.cartridgeColor,
              "border-2 border-gray-800 shadow-lg"
            )}>
              {/* Cartridge label */}
              <div className="absolute top-2 left-3 right-3 bottom-2 bg-black/30 rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-bold tracking-widest text-white/80">SEGA</div>
                  <div className="text-sm font-bold truncate px-2">{selectedGame.title}</div>
                </div>
              </div>
              
              {/* Cartridge contacts */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-yellow-800 to-yellow-600"></div>
            </div>
          )}
          
          {/* Empty slot indicator */}
          {!cartridgeInserted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 text-lg mb-2">[ EMPTY ]</div>
                <div className="text-gray-600 text-sm">INSERT CARTRIDGE BELOW</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Slot label */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-900 px-4 py-1 border border-gray-700 rounded">
          <span className="text-xs font-bold tracking-widest text-gray-400">16-BIT CARTRIDGE SLOT</span>
        </div>
      </div>
      
      {/* Cartridge Selection */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-gray-300">SELECT CARTRIDGE</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => onCartridgeInsert(game)}
              disabled={cartridgeInserted}
              className={cn(
                "relative p-3 rounded-lg border-2 transition-all transform hover:scale-105",
                cartridgeInserted 
                  ? "opacity-70 cursor-not-allowed" 
                  : "hover:border-cyan-500 active:scale-95",
                game.cartridgeColor,
                "text-white font-bold"
              )}
            >
              <div className="text-left">
                <div className="text-xs font-bold tracking-widest opacity-80">SEGA</div>
                <div className="text-sm truncate">{game.title.split(' ')[0]}</div>
              </div>
              
              {/* Selection indicator */}
              {cartridgeInserted && selectedGame.id === game.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* Eject Button */}
        {cartridgeInserted && (
          <button
            onClick={() => onCartridgeInsert(selectedGame)}
            className="mt-6 w-full py-3 bg-gradient-to-r from-red-700 to-red-900 border border-red-800 rounded-lg font-bold tracking-wider hover:from-red-800 hover:to-red-950 transition-all flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>EJECT CARTRIDGE</span>
          </button>
        )}
        
        {/* Instructions */}
        <div className="mt-6 p-3 bg-gray-950/50 border border-gray-800 rounded-lg">
          <div className="flex items-center text-sm text-gray-400">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Insert a cartridge, then press START GAME to play</span>
          </div>
        </div>
      </div>
    </div>
  );
}