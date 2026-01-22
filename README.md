# Math Game Project

**This project was created using Google Antigravity. 90% vibe coding, 10% manual interfention**

This project is a web and mobile-compatible math learning game designed for kids. It features various game modes including addition, subtraction, multiplication, division, and combination challenges.


## Tech Stack

### Frontend (Client)
- **Framework:** React 19
- **Build Tool:** Vite
- **Mobile Support:** Capacitor (Android)
- **Real-time Communication:** Socket.io-client
- **Styling:** CSS

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express
- **Real-time Communication:** Socket.io
- **Utilities:** CORS, Nodemon

## How to Run

### Prerequisites
- Node.js and npm installed on your machine.

### Step 1: Start the Server
1. Open a terminal.
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *Alternatively, for development with auto-restart:*
   ```bash
   npm run dev
   ```
   The server will run on the configured port (default is usually 3000 or 3001).

### Step 2: Start the Client
1. Open a new terminal instance.
2. Navigate to the `client` directory:
   ```bash
   cd client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Step 3: Run on Android (Capacitor)
1. Build the web project:
   ```bash
   cd client
   npm run build
   ```
2. Sync the web assets with the Android project:
   ```bash
   npx cap sync android
   ```
3. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```
4. In Android Studio, wait for Gradle to finish indexing, then select your device/emulator and click the **Run** button (green play icon).

## Multiplayer

This application is designed to support multiplayer functionality using Socket.io to allow users to play against each other in real-time.

**Note: The multiplayer feature is currently disabled.** 
While the architectural components (Socket.io on server and client) are present, the feature is not active in the current build. Future updates may re-enable and enhance this gameplay mode.
