import { useEffect, useState } from "react";
import { PhoneOff, Radio, Zap } from "lucide-react";

interface ActiveCallProps {
  agentName: string;
  era?: string;
  isSpeaking: boolean;
  status: "connecting" | "connected" | "error";
  onHangup: () => void;
  callDuration?: number;
}

const ActiveCall = ({
  agentName,
  era,
  isSpeaking,
  status,
  onHangup,
  callDuration = 0,
}: ActiveCallProps) => {
  const [barHeights, setBarHeights] = useState<number[]>([
    15, 20, 15, 20, 15, 20, 15,
  ]);
  const [dialingDots, setDialingDots] = useState("");

  // Animate bars when speaking
  useEffect(() => {
    if (!isSpeaking || status !== "connected") {
      // Reset to default without causing cascading renders
      const timeout = setTimeout(() => {
        setBarHeights([15, 20, 15, 20, 15, 20, 15]);
      }, 0);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setBarHeights(
        Array(7)
          .fill(0)
          .map(() => Math.random() * 70 + 30) // Random heights between 30-100%
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isSpeaking, status]);

  // Animate dialing dots
  useEffect(() => {
    if (status !== "connecting") return;

    const interval = setInterval(() => {
      setDialingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, [status]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="relative w-[320px]">
      {/* Outer glow frame */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-cyan-500 to-green-500 rounded-3xl blur-sm opacity-60 animate-pulse" />

      {/* Main phone body */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl p-5 border border-gray-700 shadow-2xl scanlines">
        {/* Top accent bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-b-full" />

        {/* Radio/Signal icon */}
        <div className="flex justify-center mb-3">
          <Radio className="w-5 h-5 text-green-400 animate-pulse" />
        </div>

        {/* Status Header */}
        <div className="text-center mb-4">
          {/* Connection Status Indicator */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                status === "connecting"
                  ? "bg-yellow-500 animate-pulse"
                  : status === "connected"
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            />
            <span
              className={`text-xs uppercase tracking-widest font-mono ${
                status === "connecting"
                  ? "text-yellow-400"
                  : status === "connected"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {status === "connecting"
                ? "ESTABLISHING LINK"
                : status === "connected"
                ? "LIVE CONNECTION"
                : "ERROR"}
            </span>
          </div>

          {/* Agent Name */}
          <h2 className="text-xl font-bold text-green-400 font-mono tracking-wider mb-1">
            {agentName.toUpperCase()}
          </h2>

          {/* Era */}
          {era && (
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {era}
            </p>
          )}

          {/* Call Duration */}
          {status === "connected" && (
            <p className="text-sm text-cyan-400 font-mono mt-2">
              ⏱ {formatDuration(callDuration)}
            </p>
          )}
        </div>

        {/* Main Display Area */}
        <div className="relative bg-gray-950 rounded-xl p-4 mb-4 border border-gray-700 min-h-[180px] flex items-center justify-center overflow-hidden">
          {/* Screen glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/10 to-transparent pointer-events-none" />

          {status === "connecting" ? (
            /* Connecting State - Dialing Timeline */
            <div className="text-center">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3 animate-pulse" />
              <p className="text-yellow-400 font-mono text-lg tracking-wider animate-pulse">
                DIALING TIMELINE{dialingDots}
              </p>
              <p className="text-gray-500 text-xs mt-2 font-mono">
                TRAVERSING TEMPORAL FREQUENCIES
              </p>
            </div>
          ) : (
            /* Connected State - Oscilloscope Visualizer */
            <div className="w-full">
              {/* Oscilloscope Grid Lines */}
              <div className="absolute inset-4 pointer-events-none opacity-20">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-px bg-green-500"
                    style={{ top: `${(i + 1) * 20}%` }}
                  />
                ))}
              </div>

              {/* Voice Bars */}
              <div className="flex items-end justify-center gap-2 h-[120px]">
                {barHeights.map((height, index) => (
                  <div
                    key={index}
                    className="w-6 rounded-t-sm transition-all duration-100 ease-out"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(to top, 
                        ${isSpeaking ? "#22c55e" : "#166534"} 0%, 
                        ${isSpeaking ? "#4ade80" : "#22c55e"} 50%, 
                        ${isSpeaking ? "#86efac" : "#4ade80"} 100%)`,
                      boxShadow: isSpeaking
                        ? `0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3)`
                        : "none",
                    }}
                  />
                ))}
              </div>

              {/* Speaking Indicator */}
              <div className="text-center mt-3">
                <p
                  className={`text-xs font-mono tracking-wider ${
                    isSpeaking ? "text-green-400" : "text-gray-500"
                  }`}
                >
                  {isSpeaking
                    ? "◉ RECEIVING TRANSMISSION"
                    : "○ AWAITING RESPONSE"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Audio Level Meters (decorative) */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-mono">IN</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-3 rounded-sm transition-colors ${
                    isSpeaking && i < 4
                      ? i < 2
                        ? "bg-green-500"
                        : i < 4
                        ? "bg-yellow-500"
                        : "bg-red-500"
                      : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-500 font-mono">OUT</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-3 rounded-sm transition-colors ${
                    !isSpeaking && status === "connected" && i < 3
                      ? i < 2
                        ? "bg-green-500"
                        : "bg-yellow-500"
                      : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* End Transmission Button */}
        <button
          onClick={onHangup}
          className="
            w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold
            bg-gradient-to-b from-red-600 to-red-800
            border-2 border-red-500
            text-white text-lg
            transition-all duration-150
            hover:from-red-500 hover:to-red-700
            hover:shadow-lg hover:shadow-red-500/40
            active:scale-[0.98]
            btn-glow-red
          "
        >
          <PhoneOff className="w-6 h-6" />
          <span>END TRANSMISSION</span>
        </button>

        {/* Bottom accent */}
        <div className="flex justify-center mt-4 gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-600" />
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default ActiveCall;
