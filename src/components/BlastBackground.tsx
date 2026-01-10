import { useEffect, useState } from 'react';

export default function BlastBackground({ powerOn = true }: { powerOn?: boolean }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  if (!powerOn) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)`,
        }}
      />
      
      {/* Moving grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          animation: 'grid-move 20s linear infinite',
        }}
      />
      
      {/* Pulse rings */}
      <div className="absolute inset-0">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full border border-cyan-500/30"
            style={{
              width: `${(i + 1) * 200}px`,
              height: `${(i + 1) * 200}px`,
              transform: 'translate(-50%, -50%)',
              animation: `pulse-ring 3s ease-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            left: `${Math.sin(i * 2.4) * 50 + 50}%`,
            top: `${Math.cos(i * 1.7) * 50 + 50}%`,
            animation: `float-particle 10s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
            opacity: 0.3,
            boxShadow: '0 0 8px #00FFFF',
            '--particle-dx': `${Math.random() * 40 - 20}px`,
            '--particle-dy': `${Math.random() * 40 - 20}px`,
          } as React.CSSProperties}
        />
      ))}
      
      {/* Blast processing bars */}
      <div className="absolute bottom-0 left-0 right-0 h-16 flex">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 mx-0.5 bg-gradient-to-t from-cyan-500 to-blue-700 rounded-t-lg"
            style={{
              animation: `bar-pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0.4,
              height: `${Math.sin(i * 0.5 + Date.now() / 1000) * 30 + 50}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}