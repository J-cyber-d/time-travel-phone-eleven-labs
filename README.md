# Time Travel Phone 🕰️📞

A React application that lets you "call" historical figures using ElevenLabs Conversational AI.

## Features

- **Interactive Phone Interface**: Dial specific years to reach historical figures.
- **AI-Powered Conversations**: Real-time voice conversations with Julius Caesar, Cleopatra, Einstein, and more.
- **Immersive UI**: Retro-futuristic design with sound effects and visualizers.

## Setup Instructions

### 1. Installation

```bash
npm install
```

### 2. ElevenLabs Configuration

To use the voice features, you need to set up your own ElevenLabs agents. We've included a script to automate this process!

1.  **Get your API Key**: Sign up at [ElevenLabs](https://elevenlabs.io) and get your API Key from your profile.
2.  **Configure Environment**:
    copy `.env.example` to `.env` and add your key:

    ```bash
    cp .env.example .env
    ```

    Edit `.env` and set `ELEVENLABS_API_KEY=your_key_here`.

3.  **Run the Setup Script**:
    This script will create all the necessary historical agents in your ElevenLabs account and generate their IDs.

    ```bash
    npm run setup-agents
    ```

4.  **Save Agent IDs**:
    The script will generate a file named `.env.agents` (or output to console). Copy the contents of this file into your `.env` file (replacing the empty placeholders).

### 3. Running the App

```bash
npm run dev
```

## Technologies

- React + Vite
- TypeScript
- TailwindCSS
- ElevenLabs React SDK

## License

MIT
