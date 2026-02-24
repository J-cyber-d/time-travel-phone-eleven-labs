export interface TimeCharacter {
  name: string;
  agentId: string;
  era?: string;
  greeting?: string;
}

export type TimeDirectoryType = Record<string, TimeCharacter>;

export const TIME_DIRECTORY: TimeDirectoryType = {
  "0044": {
    name: "Julius Caesar",
    agentId: import.meta.env.VITE_AGENT_ID_0044 || "",
    era: "Roman Empire",
    greeting: "Salve! Who speaks through this strange device?",
  },
  "0069": {
    name: "Cleopatra",
    agentId: import.meta.env.VITE_AGENT_ID_0069 || "",
    era: "Ancient Egypt",
    greeting: "Who dares summon the Queen of the Nile?",
  },
  "0399": {
    name: "Socrates",
    agentId: import.meta.env.VITE_AGENT_ID_0399 || "",
    era: "Ancient Greece",
    greeting: "Ah, a visitor. Tell me, what do you seek to know?",
  },
  "1429": {
    name: "Joan of Arc",
    agentId: import.meta.env.VITE_AGENT_ID_1429 || "",
    era: "Hundred Years' War",
    greeting: "I hear voices... is this another divine message?",
  },
  "1505": {
    name: "Leonardo da Vinci",
    agentId: import.meta.env.VITE_AGENT_ID_1505 || "",
    era: "Renaissance",
    greeting: "Fascinating! What manner of invention is this?",
  },
  "1776": {
    name: "Benjamin Franklin",
    agentId: import.meta.env.VITE_AGENT_ID_1776 || "",
    era: "American Revolution",
    greeting: "By thunder! Is this some form of electrical communication?",
  },
  "1863": {
    name: "Abraham Lincoln",
    agentId: import.meta.env.VITE_AGENT_ID_1863 || "",
    era: "Civil War",
    greeting: "Good day to you. How may I be of service?",
  },
  "1889": {
    name: "Nikola Tesla",
    agentId: import.meta.env.VITE_AGENT_ID_1889 || "",
    era: "Age of Electricity",
    greeting: "Remarkable! Wireless communication, just as I envisioned!",
  },
  "1911": {
    name: "Marie Curie",
    agentId: import.meta.env.VITE_AGENT_ID_1911 || "",
    era: "Radioactivity Research",
    greeting: "Bonjour! How curious... what elements power this device?",
  },
  "1945": {
    name: "Albert Einstein",
    agentId: import.meta.env.VITE_AGENT_ID_1945 || "",
    era: "Modern Physics",
    greeting: "Interesting... time and space continue to surprise me.",
  },
  "1969": {
    name: "Neil Armstrong",
    agentId: import.meta.env.VITE_AGENT_ID_1969 || "",
    era: "Space Age",
    greeting: "Houston, we have... a caller? This is unexpected.",
  },
};
