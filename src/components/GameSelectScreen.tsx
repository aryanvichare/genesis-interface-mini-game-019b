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

type GameSelectScreenProps = {
  games: Game[];
  selectedGame: Game;
  onSelectGame: (game: Game) => void;
  cartridgeInserted: boolean;
};

export default function GameSelectScreen({ games, selectedGame, onSelectGame, cartridgeInserted }: GameSelectScreenProps) {
  return (
    <div className="h-full">
      {/* Screen Border */}
      <div className="bg-gradient-to-b from-gray-900 to-black border-4 border-gray-800 rounded-xl p-1 shadow-2xl">
        {/* Screen Bezel */}
        <div className="bg-gradient-to-br from-gray-950 to-black border-2 border-gray-700 rounded-lg p-4">
          {/* Screen Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-2xl font-bold tracking-wider text-white">GAME SELECT</h2>
              <p className="text-gray-400 text-sm">CHOOSE YOUR 16-BIT ADVENTURE</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 text-sm">GENESIS</span>
            </div>
          </div>
          
          {/* Game Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {games.map((game) => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className={cn(
                  "relative cursor-pointer border-2 rounded-lg p-4 transition-all transform hover:scale-105",
                  selectedGame.id === game.id 
                    ? "border-cyan-500 bg-gradient-to-br from-gray-900 to-gray-950 scale-105 shadow-lg shadow-cyan-900/30" 
                    : "border-gray-800 bg-gradient-to-br from-gray-950 to-black hover:border-gray-600"
                )}
              >
                {/* Game Indicator */}
                <div className={cn(
                  "absolute -top-2 -left-2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white",
                  game.color
                )}>
                  {game.id}
                </div>
                
                {/* Game Title */}
                <h3 className="text-lg font-bold mb-2 pr-8">{game.title}</h3>
                
                {/* Game Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">YEAR:</span>
                    <span className="font-bold">{game.year}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">GENRE:</span>
                    <span className="font-bold text-cyan-300">{game.genre}</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-2">
                    {game.description}
                  </div>
                </div>
                
                {/* Selection Indicator */}
                {selectedGame.id === game.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Selected Game Preview */}
          <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className={cn(
                "w-full md:w-1/3 h-40 rounded-lg flex items-center justify-center mb-4 md:mb-0 md:mr-6",
                selectedGame.cartridgeColor
              )}>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold mb-2">{selectedGame.id}</div>
                  <div className="text-xl font-bold tracking-wider">SEGA</div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{selectedGame.title}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 p-3 rounded">
                    <div className="text-sm text-gray-400">RELEASE YEAR</div>
                    <div className="text-xl font-bold">{selectedGame.year}</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded">
                    <div className="text-sm text-gray-400">GENRE</div>
                    <div className="text-xl font-bold text-cyan-300">{selectedGame.genre}</div>
                  </div>
                </div>
                <p className="text-gray-300">{selectedGame.description}</p>
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-950/50 border border-gray-800 rounded-lg">
            <div className="flex items-center mb-2 md:mb-0">
              <svg className="w-6 h-6 text-cyan-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-gray-300">BLAST PROCESSING READY</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-6 bg-gray-800 border border-gray-700 rounded flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">A</span>
                </div>
                <span className="text-sm text-gray-400">SELECT</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-6 bg-gray-800 border border-gray-700 rounded flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">B</span>
                </div>
                <span className="text-sm text-gray-400">BACK</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-6 bg-gray-800 border border-gray-700 rounded flex items-center justify-center mr-2">
                  <span className="text-xs font-bold">C</span>
                </div>
                <span className="text-sm text-gray-400">START</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="mt-4 flex flex-wrap justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-bold",
            cartridgeInserted ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
          )}>
            {cartridgeInserted ? "CARTRIDGE INSERTED" : "NO CARTRIDGE"}
          </div>
          <div className="px-3 py-1 bg-cyan-900/30 text-cyan-400 rounded-full text-sm font-bold">
            16-BIT MODE
          </div>
        </div>
        
        <div className="flex items-center mt-2 md:mt-0">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
          <span className="text-sm text-gray-400">REC</span>
          <div className="mx-2 text-gray-600">•</div>
          <span className="text-sm text-gray-400">68000 CPU: 7.67 MHz</span>
        </div>
      </div>
    </div>
  );
}