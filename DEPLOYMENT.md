# Deployment Guide

The Sega Genesis Console Interface is now ready for deployment!

## Built Assets

After running `npm run build`, the following files are generated in the `dist/` directory:

- `index.html` - The complete single-page application (all CSS and JS inlined)
- `assets/` - Any static assets (if used)

## Hosting Options

### 1. Static Hosting (Recommended)
The build outputs a single HTML file that can be hosted on any static file server:

- **Netlify**: Drag and drop the `dist` folder to Netlify
- **Vercel**: `vercel --prod`
- **GitHub Pages**: Enable GitHub Pages on the `dist` directory
- **Cloudflare Pages**: Connect repository and set build command to `npm run build`
- **Any web server**: Copy `dist` contents to your web server root

### 2. Local Testing
To test the built version locally:
```bash
npm run preview
```
Then open http://localhost:4173

### 3. Docker Deployment
Create a simple Dockerfile:
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
```

## Environment Variables

No environment variables are required for this application.

## Performance Features

- **Single File Output**: All assets are inlined into one HTML file for fast loading
- **Code Splitting**: React components are optimized for production
- **Gzip Compression**: Enable on your server for smaller file sizes
- **Cache Headers**: Configure appropriate cache headers for static assets

## Cool Features Already Included

✅ **Fully Interactive Sega Genesis Console** with power button, cartridge slot, and controller ports  
✅ **Game Selection Screen** with 6 classic Sega Genesis games  
✅ **Playable 16-bit Mini-Game** with enemies, power-ups, and scoring  
✅ **Blast Processing Visual Effects** with animated backgrounds  
✅ **CRT Scanlines Effect** (toggleable)  
✅ **High Score Saving** using localStorage  
✅ **Responsive Design** works on desktop and mobile  
✅ **Keyboard and Mouse Controls** for the mini-game  
✅ **Audio Feedback** for cartridge insertion  

## Making It Even Cooler (Future Enhancements)

1. **Add more games** with different mini-game mechanics
2. **Multiplayer support** for the mini-game
3. **Achievements system** with unlockable content
4. **Soundtrack player** with classic Genesis music
5. **Save states** for the mini-game
6. **Controller support** for gamepads
7. **Secret cheat codes** (Konami code, etc.)

## Troubleshooting

If the build fails:
1. Ensure Node.js version 18+ is installed
2. Run `npm install` to install dependencies
3. Check for TypeScript errors with `npm run type-check`

If the game doesn't load:
1. Check browser console for errors
2. Ensure JavaScript is enabled
3. Try clearing browser cache

## Credits

This project is a fan-made tribute to the Sega Genesis console. All game titles and references are trademarks of their respective owners.

## License

This project is for demonstration purposes only. Not for commercial use.

---

**Blast Processing Activated!** 🚀