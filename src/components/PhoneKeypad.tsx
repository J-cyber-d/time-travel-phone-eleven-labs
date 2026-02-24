import React from "react";
import { Phone, PhoneOff, Delete, Zap, Shuffle } from "lucide-react";
import AudioVisualizer from "./AudioVisualizer";
import { TIME_DIRECTORY } from "../data/timeDirectory";

// Get all available years from the directory
const AVAILABLE_YEARS = Object.keys(TIME_DIRECTORY);

type CallStatus = "idle" | "connecting" | "connected" | "error";

interface PhoneKeypadProps {
  dialedNumber: string;
  setDialedNumber: React.Dispatch<React.SetStateAction<string>>;
  callStatus: CallStatus;
  currentCharacter: string | null;
  onCall: () => void;
  onHangUp: () => void;
  isShaking: boolean;
}

const PhoneKeypad: React.FC<PhoneKeypadProps> = ({
  dialedNumber,
  setDialedNumber,
  callStatus,
  currentCharacter,
  onCall,
  onHangUp,
  isShaking,
}) => {
  const handleNumberClick = (num: string) => {
    if (dialedNumber.length < 4 && callStatus === "idle") {
      setDialedNumber((prev) => prev + num);
    }
  };

  const handleClear = () => {
    if (callStatus === "idle") {
      setDialedNumber((prev) => prev.slice(0, -1));
    }
  };

  const handleClearAll = () => {
    if (callStatus === "idle") {
      setDialedNumber("");
    }
  };

  // * = Random Year - picks a random year from available characters
  const handleRandomYear = () => {
    if (callStatus === "idle") {
      const randomYear =
        AVAILABLE_YEARS[Math.floor(Math.random() * AVAILABLE_YEARS.length)];
      setDialedNumber(randomYear);
    }
  };

  // # = Enter/Call shortcut - same as clicking CALL button
  const handleHashKey = () => {
    if (callStatus === "idle" && dialedNumber.length === 4) {
      onCall();
    }
  };

  const numberButtons = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "*",
    "0",
    "#",
  ];

  const getDisplayText = () => {
    if (callStatus === "error") {
      return "ERA UNREACHABLE";
    }
    if (callStatus === "connecting" && currentCharacter) {
      return `CONNECTING...`;
    }
    if (callStatus === "connected" && currentCharacter) {
      return currentCharacter.toUpperCase();
    }
    return dialedNumber.padEnd(4, "_");
  };

  const getCharacterHint = () => {
    if (dialedNumber.length === 4 && callStatus === "idle") {
      const character = TIME_DIRECTORY[dialedNumber];
      if (character) {
        return `${character.name} • ${character.era}`;
      }
    }
    return null;
  };

  const isCallActive =
    callStatus === "connecting" || callStatus === "connected";

  return (
    <div className="relative">
      {/* Outer glow frame */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-sm opacity-50" />

      {/* Main phone body */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl p-5 border border-gray-700 shadow-2xl w-[320px] scanlines">
        {/* Top accent bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-b-full" />

        {/* Antenna / Receiver icon */}
        <div className="flex justify-center mb-3">
          <Zap className="w-5 h-5 text-cyan-400" />
        </div>

        {/* Digital Display */}
        <div
          className={`relative bg-gray-950 rounded-xl p-3 mb-4 border border-gray-700 overflow-hidden ${
            isShaking ? "shake" : ""
          }`}
        >
          {/* Display screen effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />

          {/* Main display text */}
          <div
            className={`digital-display text-center text-3xl tracking-wider ${
              callStatus === "error"
                ? "text-red-400"
                : callStatus === "connected"
                ? "text-green-400"
                : "text-cyan-400"
            }`}
          >
            {getDisplayText()}
          </div>

          {/* Character hint */}
          {getCharacterHint() && (
            <div className="text-center text-xs text-gray-400 mt-2 font-sans">
              {getCharacterHint()}
            </div>
          )}

          {/* Connecting status */}
          {callStatus === "connecting" && currentCharacter && (
            <div className="text-center text-sm text-cyan-300 mt-2 connecting-text">
              Reaching {currentCharacter}...
            </div>
          )}
        </div>

        {/* Audio Visualizer (shown during call) */}
        {callStatus === "connected" && <AudioVisualizer isActive={true} />}

        {/* Number Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {numberButtons.map((num) => {
            // Special button handlers for * and #
            const handleClick = () => {
              if (num === "*") {
                handleRandomYear();
              } else if (num === "#") {
                handleHashKey();
              } else {
                handleNumberClick(num);
              }
            };

            // Determine if button should be disabled
            const isDisabled =
              callStatus !== "idle" ||
              (num === "#" && dialedNumber.length !== 4);

            return (
              <button
                key={num}
                onClick={handleClick}
                disabled={isDisabled}
                title={
                  num === "*"
                    ? "Random Year"
                    : num === "#"
                    ? "Call (Enter)"
                    : undefined
                }
                className={`
                  relative h-12 rounded-xl font-bold text-xl
                  bg-gradient-to-b from-gray-800 to-gray-900
                  border border-gray-600 
                  text-gray-200
                  transition-all duration-150
                  hover:from-gray-700 hover:to-gray-800
                  active:scale-95 active:from-gray-900 active:to-gray-950
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    num === "*"
                      ? "hover:border-purple-500 hover:text-purple-300"
                      : num === "#"
                      ? "hover:border-green-500 hover:text-green-300"
                      : "hover:border-cyan-500 hover:text-cyan-300"
                  }
                  ${
                    num === "*"
                      ? "btn-glow-purple"
                      : num === "#"
                      ? "btn-glow-green"
                      : "btn-glow-cyan"
                  }
                `}
              >
                <span className="flex items-center justify-center gap-1">
                  {num === "*" && <Shuffle className="w-4 h-4" />}
                  {num}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Clear Button */}
          <button
            onClick={handleClear}
            onDoubleClick={handleClearAll}
            disabled={callStatus !== "idle" || dialedNumber.length === 0}
            className={`
              flex items-center justify-center gap-2 h-12 rounded-xl font-bold
              bg-gradient-to-b from-gray-700 to-gray-800
              border border-gray-600
              text-gray-300
              transition-all duration-150
              hover:from-gray-600 hover:to-gray-700
              hover:border-yellow-500 hover:text-yellow-300
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Delete className="w-5 h-5" />
            <span className="text-sm">CLEAR</span>
          </button>

          {/* Call / Hang Up Button */}
          {!isCallActive ? (
            <button
              onClick={onCall}
              disabled={dialedNumber.length !== 4}
              className={`
                flex items-center justify-center gap-2 h-12 rounded-xl font-bold
                bg-gradient-to-b from-green-600 to-green-800
                border border-green-500
                text-white
                transition-all duration-150
                hover:from-green-500 hover:to-green-700
                hover:shadow-lg hover:shadow-green-500/30
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
                btn-glow-green
              `}
            >
              <Phone className="w-5 h-5" />
              <span className="text-sm">CALL</span>
            </button>
          ) : (
            <button
              onClick={onHangUp}
              className={`
                flex items-center justify-center gap-2 h-12 rounded-xl font-bold
                bg-gradient-to-b from-red-600 to-red-800
                border border-red-500
                text-white
                transition-all duration-150
                hover:from-red-500 hover:to-red-700
                hover:shadow-lg hover:shadow-red-500/30
                active:scale-95
                btn-glow-red
              `}
            >
              <PhoneOff className="w-5 h-5" />
              <span className="text-sm">HANG UP</span>
            </button>
          )}
        </div>

        {/* Bottom accent */}
        <div className="flex justify-center mt-3 gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-600" />
          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50" />
          <div className="w-2 h-2 rounded-full bg-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default PhoneKeypad;
