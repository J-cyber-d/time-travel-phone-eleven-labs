import React from "react";
import { ArrowLeft, Cpu, Globe, Mic } from "lucide-react";
import demoVideo from "../assets/video/Futuristic_Phone_in_Temporal_Vortex.mp4";

interface AboutPageProps {
  onBack: () => void;
}

const Card = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 p-6 rounded-xl transition-all hover:bg-gray-900">
    <div className="mb-4 bg-gray-950 w-16 h-16 rounded-lg flex items-center justify-center border border-gray-800">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-200 mb-3">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

// Helper Component for Steps
const Step = ({
  number,
  title,
  text,
}: {
  number: number;
  title: string;
  text: string;
}) => (
  <div className="flex gap-4 items-start border-l border-gray-800 pl-4 py-2 hover:border-cyan-500/50 transition-colors">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
      {number}
    </div>
    <div>
      <h3 className="font-bold text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{text}</p>
    </div>
  </div>
);

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-100 flex flex-col font-mono relative overflow-hidden">
      {/* Background Elements */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url('${
            import.meta.env.VITE_BG_IMAGE_URL ||
            "https://images.unsplash.com/photo-1534224039826-c7a11806decf?q=80&w=2070&auto=format&fit=crop"
          }')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-transparent to-gray-950 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Phone</span>
        </button>
        <span className="text-xs text-gray-500 uppercase tracking-widest">
          Project: {import.meta.env.VITE_APP_CODENAME || "CHRONOS"}
        </span>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Bridging History with Artificial Intelligence
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              The {import.meta.env.VITE_APP_TITLE || "Time Travel Phone"} is an
              experimental interface that allows real-time voice conversations
              with historical figures, powered by advanced generative AI.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 border border-cyan-500/30 rounded-full bg-cyan-500/10 text-cyan-300 text-sm">
                React + Vite
              </div>
              <div className="px-4 py-2 border border-purple-500/30 rounded-full bg-purple-500/10 text-purple-300 text-sm">
                ElevenLabs AI
              </div>
            </div>
          </div>

          {/* AI Video Showcase Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 aspect-video flex items-center justify-center shadow-2xl">
              <video
                src={demoVideo}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Overlay for a more cinematic feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-gray-950/20 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* How to Setup Section */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-cyan-500 pl-4">
            How to Build Your Own
          </h2>
          <div className="grid md:grid-cols-1 gap-6 bg-gray-900/40 p-8 rounded-2xl border border-gray-800">
            <Step
              number={1}
              title="Clone & Install"
              text="Clone the repo from GitHub and run `npm install` to get the dependencies."
            />
            <Step
              number={2}
              title="Get ElevenLabs Key"
              text="Sign up at ElevenLabs.io and retrieve your API Key from the profile settings."
            />
            <Step
              number={3}
              title="Run Setup Script"
              text="Execute `npm run setup-agents`. This automated script creates all the historical personas in your ElevenLabs account."
            />
            <Step
              number={4}
              title="Configure Environment"
              text="The script generates an `.env.agents` file. Copy these IDs into your `.env` file to link the phone to your agents."
            />
            <Step
              number={5}
              title="Start Dialing"
              text="Run `npm run dev` and start calling Julius Caesar, Einstein, or Cleopatra!"
            />
          </div>
        </div>

        {/* Technical Architecture */}
        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-purple-500 pl-4">
          Tech Stack
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <Card
            icon={<Mic className="w-8 h-8 text-cyan-400" />}
            title="Voice Synthesis"
            description="ElevenLabs Turbo v2 model for ultra-low latency speech. Custom voice clones for each historical figure."
          />
          <Card
            icon={<Cpu className="w-8 h-8 text-purple-400" />}
            title="Conversational AI"
            description="ElevenAgents platform managing the LLM context, system prompts, and personality guardrails."
          />
          <Card
            icon={<Globe className="w-8 h-8 text-pink-400" />}
            title="Modern Frontend"
            description="React 18, Vite, TailwindCSS, and lucide-react for a performant, responsive, and beautiful interface."
          />
        </div>

        {/* Footer Info */}
        <footer className="border-t border-gray-800 pt-12 pb-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Let's Connect</h3>
          <div className="flex justify-center gap-6 mb-8">
            <a
              href={`mailto:${
                import.meta.env.VITE_CONTACT_EMAIL || "your.email@example.com"
              }`}
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <span className="text-sm">📧 Email Me</span>
            </a>
            <a
              href={
                import.meta.env.VITE_LINKEDIN_URL ||
                "https://linkedin.com/in/yourprofile"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <span className="text-sm">🔗 LinkedIn</span>
            </a>
            <a
              href={import.meta.env.VITE_GITHUB_URL || "#"}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <span className="text-sm">🐙 GitHub Profile</span>
            </a>
          </div>
          <p className="text-gray-600 text-xs">
            © 2024 {import.meta.env.VITE_APP_TITLE || "Time Travel Phone"}. Open
            Source Project.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default AboutPage;
