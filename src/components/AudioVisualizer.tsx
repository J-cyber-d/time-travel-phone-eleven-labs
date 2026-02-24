import React from "react";

interface AudioVisualizerProps {
  isActive: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="relative flex items-center justify-center my-6">
      {/* Outer pulsing rings */}
      <div className="absolute w-24 h-24 rounded-full bg-cyan-400/20 pulse-ring" />
      <div
        className="absolute w-24 h-24 rounded-full bg-cyan-400/20 pulse-ring"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute w-24 h-24 rounded-full bg-cyan-400/20 pulse-ring"
        style={{ animationDelay: "1s" }}
      />

      {/* Main pulsing circle */}
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 pulse-visualizer flex items-center justify-center shadow-lg shadow-cyan-500/50">
        {/* Inner glow */}
        <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm" />
      </div>

      {/* Audio wave bars */}
      <div className="absolute flex gap-1 items-center">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-cyan-400 rounded-full"
            style={{
              height: `${Math.random() * 20 + 10}px`,
              animation: `pulse 0.5s ease-in-out ${
                i * 0.1
              }s infinite alternate`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;
