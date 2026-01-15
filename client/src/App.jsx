import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';
import Lobby from './pages/Lobby';
import Highscores from './pages/Highscores';
import { SplashScreen as NativeSplash } from '@capacitor/splash-screen';
import SplashScreen from './components/SplashScreen';

function App() {
  const [screen, setScreen] = useState('home'); // home, game, lobby, multi-game, highscores
  const [gameConfig, setGameConfig] = useState(null);
  const [multiData, setMultiData] = useState(null); // { fullRoundData, roomId }
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    NativeSplash.hide();
  }, []);

  const startGame = (config) => {
    setGameConfig(config);
    setScreen('game');
  };

  const startMultiplayer = (data) => {
    // Data from 'game_start' event
    // We need to know roomId too.
    // Lobby handles join, but we need to track roomId in App or pass from Lobby.
    // Better: pass roomId via state from lobby.
    setMultiData(data);
    setScreen('multi-game');
  };

  const toHome = () => {
    setScreen('home');
    setGameConfig(null);
    setMultiData(null);
    socket.disconnect();
  };

  // Helper to intercept Lobby start
  const onLobbyStart = (data, roomId) => {
    setMultiData({ ...data, roomId });
    setScreen('multi-game');
  };

  return (
    <div className="container flex-center">
      {screen === 'home' && (
        <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem' }}>
          <Home onStart={startGame} onShowHighscores={() => setScreen('highscores')} />
          {/* <button
            className="btn btn-secondary"
            onClick={() => setScreen('lobby')}
            style={{ marginTop: '1rem' }}
          >
            Multiplayer Mode
          </button> */}
        </div>
      )}

      {screen === 'game' && <Game config={gameConfig} onEnd={toHome} />}

      {screen === 'lobby' && <Lobby onStartGame={onLobbyStart} />}

      {screen === 'multi-game' && <MultiplayerGame initialData={multiData} onEnd={toHome} />}

      {screen === 'highscores' && <Highscores onBack={toHome} />}

      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
    </div>
  );
}

export default App;
