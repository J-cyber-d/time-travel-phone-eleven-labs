import { useEffect, useRef } from "react";

// Import character images
import caesar from "../assets/characters/caesar.png";
import cleopatra from "../assets/characters/cleopatra.png";
import socrates from "../assets/characters/socrates.png";
import joanOfArc from "../assets/characters/joan_of_arc.png";
import leonardo from "../assets/characters/leonardo.png";
import franklin from "../assets/characters/franklin.png";
import lincoln from "../assets/characters/lincoln.png";
import tesla from "../assets/characters/tesla.png";
import curie from "../assets/characters/curie.png";
import einstein from "../assets/characters/einstein.png";
import armstrong from "../assets/characters/armstrong.png";

interface CharacterImage {
  src: string;
  name: string;
  year: string;
  era: string;
}

const CHARACTERS: CharacterImage[] = [
  { src: caesar, name: "Julius Caesar", year: "0044", era: "Roman Empire" },
  { src: cleopatra, name: "Cleopatra", year: "0069", era: "Ancient Egypt" },
  { src: socrates, name: "Socrates", year: "0399", era: "Ancient Greece" },
  { src: joanOfArc, name: "Joan of Arc", year: "1429", era: "Medieval France" },
  {
    src: leonardo,
    name: "Leonardo da Vinci",
    year: "1505",
    era: "Renaissance",
  },
  { src: franklin, name: "Benjamin Franklin", year: "1776", era: "Revolution" },
  { src: lincoln, name: "Abraham Lincoln", year: "1863", era: "Civil War" },
  { src: tesla, name: "Nikola Tesla", year: "1889", era: "Electricity" },
  { src: curie, name: "Marie Curie", year: "1911", era: "Radioactivity" },
  { src: einstein, name: "Albert Einstein", year: "1945", era: "Physics" },
  { src: armstrong, name: "Neil Armstrong", year: "1969", era: "Space Age" },
];

interface BackgroundCarouselProps {
  activeYear?: string | null;
  speed?: number; // seconds for one complete scroll
  onYearSelect?: (year: string) => void;
}

const BackgroundCarousel = ({
  activeYear,
  speed = 30,
  onYearSelect,
}: BackgroundCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pause animation when hovering
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleMouseEnter = () => {
      el.style.animationPlayState = "paused";
    };
    const handleMouseLeave = () => {
      el.style.animationPlayState = "running";
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Duplicate the array for seamless infinite scroll
  const duplicatedCharacters = [...CHARACTERS, ...CHARACTERS];

  return (
    <div className="w-full overflow-hidden py-4 relative">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

      {/* Scrolling container */}
      <div
        ref={scrollRef}
        className="flex gap-4 animate-scroll"
        style={{
          animationDuration: `${speed}s`,
          width: "fit-content",
        }}
      >
        {duplicatedCharacters.map((character, index) => (
          <div
            key={`${character.year}-${index}`}
            onClick={() => onYearSelect?.(character.year)}
            className={`
              flex-shrink-0 w-28 group cursor-pointer transition-all duration-300
              ${
                activeYear === character.year
                  ? "scale-110 z-20"
                  : "hover:scale-105"
              }
            `}
          >
            {/* Card */}
            <div
              className={`
                relative rounded-xl overflow-hidden border-2 transition-all duration-300
                ${
                  activeYear === character.year
                    ? "border-cyan-400 shadow-lg shadow-cyan-400/30"
                    : "border-gray-700/50 hover:border-gray-500"
                }
              `}
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={character.src}
                  alt={character.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

              {/* Year badge */}
              <div className="absolute top-2 right-2">
                <span
                  className={`
                    text-[10px] font-mono px-1.5 py-0.5 rounded
                    ${
                      activeYear === character.year
                        ? "bg-cyan-500 text-gray-900"
                        : "bg-gray-800/80 text-cyan-400"
                    }
                  `}
                >
                  {character.year}
                </span>
              </div>

              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <p className="text-white text-[10px] font-medium leading-tight truncate">
                  {character.name}
                </p>
                <p className="text-gray-400 text-[8px] uppercase tracking-wider">
                  {character.era}
                </p>
              </div>

              {/* Active glow */}
              {activeYear === character.year && (
                <div className="absolute inset-0 ring-2 ring-cyan-400 ring-inset rounded-xl animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundCarousel;
