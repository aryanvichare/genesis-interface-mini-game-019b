# Sega Genesis Console Interface

A 16-bit Sega Genesis console interface built with React, Vite, and Tailwind CSS. Features a fully interactive console with cartridge slot, game selection screen, and a playable mini-game with blast processing aesthetic.

## Features

### 🎮 Console Interface
- Realistic Sega Genesis console replica with power button, cartridge slot, and controller ports
- Interactive cartridge insertion and ejection
- Power on/off functionality with LED indicators
- Console specifications display (Motorola 68000 CPU, 7.67 MHz, etc.)

### 📺 Game Selection Screen
- Grid of classic Sega Genesis games with details
- Visual cartridge representation for each game
- Selected game preview with description and metadata
- Blast processing status indicator

### 🕹️ Playable Mini-Game
- Interactive 16-bit style action game
- Player movement with keyboard (arrow keys) and mouse controls
- Enemy AI with collision detection
- Projectile shooting mechanics
- Score tracking, lives system, and game time
- Pause/resume functionality
- Game over and restart system

### 🎨 Visual Design
- Authentic 16-bit graphics style with pixelated elements
- CRT scanline effect (toggleable)
- Blast processing visual effects with glowing animations
- Retro color palette matching Sega Genesis aesthetics
- Responsive design for various screen sizes

## How to Use

1. **Power On**: Click the POWER button to activate the console
2. **Insert Cartridge**: Select a game from the cartridge slot section
3. **Start Game**: Press START GAME button to launch the selected title
4. **Play Mini-Game**:
   - Move: Arrow keys or click/tap on game area
   - Shoot: Spacebar or click/tap (shoots toward cursor)
   - Pause: Press 'P' key or use the PAUSE button
5. **Toggle Effects**: Use CRT ON/OFF button to enable/disable scanlines

## Technical Implementation

- Built with **React 19** and **TypeScript**
- Styled with **Tailwind CSS** for rapid UI development
- **Vite** for fast build tooling
- Game physics and rendering using requestAnimationFrame
- Component-based architecture with reusable UI components

## Components

- `App.tsx`: Main application container and state management
- `GenesisConsole.tsx`: Console visualization and controls
- `GameCartridgeSlot.tsx`: Cartridge insertion interface
- `GameSelectScreen.tsx`: Game selection grid and details
- `MiniGame.tsx`: Interactive 16-bit action game
- `utils/cn.ts`: CSS class name utility

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Blast Processing

The interface showcases the legendary "Blast Processing" marketing term used by Sega to highlight the Genesis's superior speed over competitors. Visual effects and animations throughout the interface simulate this high-speed processing aesthetic.

## Credits

- Sega Genesis is a trademark of Sega
- Game titles and descriptions reference actual Sega Genesis classics
- Design inspired by 16-bit console aesthetics
- Built as a demonstration project

## License

This project is for demonstration purposes only. All game titles, Sega, and Genesis are trademarks of their respective owners.