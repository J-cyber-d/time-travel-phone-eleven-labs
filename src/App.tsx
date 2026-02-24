import { useState, useCallback, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { Info } from "lucide-react";
import PhoneKeypad from "./components/PhoneKeypad";
import ActiveCall from "./components/ActiveCall";
import BackgroundCarousel from "./components/BackgroundCarousel";
import AboutPage from "./components/AboutPage";
import { TIME_DIRECTORY } from "./data/timeDirectory";
import "./index.css";

type CallStatus = "idle" | "connecting" | "connected" | "error";

function App() {
  const [dialedNumber, setDialedNumber] = useState("");
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null);
  const [currentEra, setCurrentEra] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // About page state
  const [showAbout, setShowAbout] = useState(false);

  // Initialize ElevenLabs conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setCallStatus("connected");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      // Don't reset to idle immediately - might be a temporary disconnect
      // Check if we're still in a call state
      setCallStatus((prev) => (prev === "connected" ? "idle" : prev));
      setCurrentCharacter(null);
      setCurrentEra(null);
      setCallDuration(0);
    },
    onError: (error) => {
      // Defensive check - SDK sometimes passes undefined/malformed errors
      const errorString =
        typeof error === "string" ? error : JSON.stringify(error);
      const errorMessage =
        typeof error === "string"
          ? error
          : (error as { message?: string; error_type?: string })?.message ||
            (error as { message?: string; error_type?: string })?.error_type ||
            "Unknown error";

      console.error("ElevenLabs error:", errorMessage, error);

      // Check for credit/quota issues
      if (
        errorString.toLowerCase().includes("quota") ||
        errorString.toLowerCase().includes("credit") ||
        errorMessage.toLowerCase().includes("quota") ||
        errorMessage.toLowerCase().includes("credit")
      ) {
        alert(
          "⚠️ API CREDITS EXHAUSTED\n\nPlease check your ElevenLabs billing or try again later.",
        );
      }

      // Only trigger error state for real errors, not SDK bugs
      if (error) {
        setCallStatus("error");
        triggerShake();
        setTimeout(() => {
          setCallStatus("idle");
        }, 2000);
      }
    },
    onMessage: (message) => {
      // Track speaking state from messages
      if (message) {
        console.log("Message:", message);
      }
    },
  });

  // Call duration timer
  useEffect(() => {
    if (callStatus !== "connected") {
      return;
    }

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus]);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  const handleCall = useCallback(async () => {
    // Check if the dialed year exists in the directory
    const character = TIME_DIRECTORY[dialedNumber];

    if (!character) {
      // Invalid year - trigger error state
      setCallStatus("error");
      triggerShake();
      setTimeout(() => {
        setCallStatus("idle");
      }, 1500);
      return;
    }

    // Valid year - initiate connection
    setCurrentCharacter(character.name);
    setCurrentEra(character.era || null);
    setCallStatus("connecting");

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the ElevenLabs session with the agent ID
      await conversation.startSession({
        agentId: character.agentId,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Failed to start session:", error);
      setCallStatus("error");
      triggerShake();
      setTimeout(() => {
        setCallStatus("idle");
        setCurrentCharacter(null);
        setCurrentEra(null);
      }, 2000);
    }
  }, [dialedNumber, conversation, triggerShake]);

  const handleHangUp = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Failed to end session:", error);
    }
    setCallStatus("idle");
    setCurrentCharacter(null);
    setCurrentEra(null);
    setDialedNumber("");
    setCallDuration(0);
  }, [conversation]);

  // Check if call is active (connecting or connected)
  const isCallActive =
    callStatus === "connecting" || callStatus === "connected";

  if (showAbout) {
    return <AboutPage onBack={() => setShowAbout(false)} />;
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 bg-grid flex flex-col items-center justify-start py-8 px-4 relative overflow-y-auto">
      {/* Background ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Info / Setup Guide Button */}
      <button
        onClick={() => setShowAbout(true)}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-cyan-950/80 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-bold tracking-wider hover:bg-cyan-900/90 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all group animate-pulse hover:animate-none"
      >
        <span className="hidden sm:inline">SETUP GUIDE</span>
        <Info className="w-4 h-4 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Header */}
      <div className="relative z-10 text-center mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 tracking-wider">
          {import.meta.env.VITE_APP_TITLE || "TIME TRAVEL PHONE"}
        </h1>

        <p className="text-gray-400 text-sm tracking-widest uppercase">
          Dial a year • Connect to history
        </p>
      </div>

      {/* Carousel of Historical Figures - Click to Dial */}
      <div className="relative z-10 mb-6 w-full max-w-4xl">
        <BackgroundCarousel
          activeYear={dialedNumber.length === 4 ? dialedNumber : null}
          speed={40}
          onYearSelect={(year) => {
            if (callStatus === "idle") {
              setDialedNumber(year);
            }
          }}
        />
        <p className="text-gray-600 text-[10px] text-center mt-2 uppercase tracking-widest">
          Scroll to explore • Click card to dial
        </p>
      </div>

      {/* Phone Keypad or Active Call */}
      <div className="relative z-10">
        {isCallActive && currentCharacter ? (
          <ActiveCall
            agentName={currentCharacter}
            era={currentEra || undefined}
            isSpeaking={conversation.isSpeaking}
            status={callStatus as "connecting" | "connected" | "error"}
            onHangup={handleHangUp}
            callDuration={callDuration}
          />
        ) : (
          <PhoneKeypad
            dialedNumber={dialedNumber}
            setDialedNumber={setDialedNumber}
            callStatus={callStatus}
            currentCharacter={currentCharacter}
            onCall={handleCall}
            onHangUp={handleHangUp}
            isShaking={isShaking}
          />
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-6 text-center text-gray-600 text-xs">
        <p>Powered by ElevenLabs Voice AI</p>
      </div>
    </div>
  );
}

export default App;
