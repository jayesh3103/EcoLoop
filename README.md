# EcoLoop: NPU-Native Circular Agent

EcoLoop is an ultra-premium React Native (Expo) application designed to facilitate the circular economy within campus environments. Originally built as part of a Hackathon project, it seamlessly connects users with surplus materials to those who need them—or generates AI-driven upcycling instructions when no local match is found.

## Features

- **Immersive Authentic UI:** Features a high-fidelity, "Glassmorphism" aesthetic with custom font typography (Space Grotesk & Inter), deep dark themes, and dynamic neon green aurora background animations.
- **Cross-Platform Responsive Design:** Fully responsive on both mobile iOS/Android and Web/Desktop environments. The layout dynamically constrains center content on larger laptops.
- **Agent Initialization & Authorization:** Beautiful auth flows with delayed micro-interactions and haptic feedback.
- **Semantic RAG Matching:** Cross-references user inventory with a local campus database to find potential component buyers (e.g., matching a discarded Stepper Motor to a Robotics Club).
- **Automated Upcycling Generation:** If a match isn't found, the Agent suggests a comprehensive DIY upcycle manifest, projecting the theoretical CO2 offset.
- **NPU Scanner Emulation:** A sophisticated animated camera overlay designed to emulate advanced hardware scanning and tracking systems.

## Tech Stack

- **Framework:** React Native / [Expo Router](https://docs.expo.dev/router/introduction/)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (physics-based spring animations, sequences, delays)
- **Styling:** Vanilla StyleSheet + `expo-linear-gradient` + `expo-blur`
- **Feedback:** `expo-haptics`
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Fonts:** `@expo-google-fonts/space-grotesk`, `@expo-google-fonts/inter`

## Getting Started

### Prerequisites

You need Node.js and npm installed on your machine.
Ensure you have the Expo CLI installed globally, or just run using `npx`.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/EcoLoop.git
   ```
2. Navigate into the project directory:
   ```bash
   cd EcoLoop
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   _(Note: This project uses `npm` as the package manager)_

### Running the Application (Frontend & Backend)

#### 1. Start the Backend API

The sophisticated NPU emulation and object scanning vectors are powered by a Python FastAPI backend.

1. Open a new terminal.
2. Navigate to the backend directory:
   ```bash
   cd EcoLoop/backend
   ```
3. Set up a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### 2. Start the Frontend App

1. Open another terminal and navigate back to the root project directory:
   ```bash
   cd EcoLoop
   ```
2. Start the Expo development server:
   ```bash
   npx expo start --clear
   ```

- **Press `i`** to open in an iOS Simulator.
- **Press `a`** to open in an Android Emulator.
- **Press `w`** to open in a web browser (fully responsive layout supported).

## Project Structure

```text
EcoLoop/
├── backend/              # Python FastAPI Machine Learning backend
│   ├── main.py           # Core API & Scanner emulation logic
│   └── requirements.txt  # Backend dependencies
├── app/
│   ├── _layout.tsx       # Root Navigation Layout
│   ├── index.tsx         # Login Screen
│   ├── signup.tsx        # Registration Screen
│   ├── (tabs)/           # Main App Dashboard Layout
│   │   ├── _layout.tsx   # Custom animated Tab Bar layout
│   │   ├── index.tsx     # Activity Dashboard / Feed
│   │   └── scanner.tsx   # Camera NPU Scanner emulation
│   ├── match.tsx         # Target Acquired Match Screen (Modal)
│   └── diy.tsx           # Generated DIY Guide Screen (Modal)
├── components/           # Reusable UI components
│   ├── CarbonCard.js
│   ├── ScanButton.js
│   └── MatchResult.js
├── data.js               # Mock datasets for the RAG matching
└── README.md
```

## Deployment

Deploying EcoLoop requires hosting the Frontend (React Native Web) and the Backend (Python FastAPI) separately.

### 1. Deploying the Backend (Render, Railway, or Heroku)

**Render** is highly recommended for an easy, free FastAPI deployment:

1. Create a **Web Service** on [Render.com](https://render.com) and connect this GitHub repo.
2. Set the **Root Directory** to `backend`.
3. Set the **Build Command** to `pip install -r requirements.txt`.
4. Set the **Start Command** to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
5. Deploy! Render will give you a live URL (e.g., `https://ecoloop-api.onrender.com`).

### 2. Deploying the Frontend (Vercel, Netlify, or GitHub Pages)

_Note: Before deploying, remember to search your frontend code for `http://localhost:8000` (e.g., in your scanner component) and replace it with your newly deployed Backend URL._

**Vercel** is highly recommended for Expo Web apps:

1. Go to [Vercel.com](https://vercel.com) and import your GitHub repository.
2. Set the **Framework Preset** to `Other`.
3. Set the **Build Command** to `npx expo export -p web`.
4. Set the **Output Directory** to `dist`.
5. Click **Deploy**! Vercel will build the web-optimized version of the React Native app and provide you with a live URL.

## Acknowledgments

Built to demonstrate cutting-edge UX/UI engineering and the power of beautiful, constrained animations to reduce visual noise.
