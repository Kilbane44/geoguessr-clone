import React, { useState, useEffect } from 'react';
import Game from './Game';
import StartScreen from './StartScreen';
import EndScreen from './EndScreen';

const MAX_ROUNDS = 5;

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, end
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Generate random locations when the component mounts
    const randomLocations = generateRandomLocations(MAX_ROUNDS);
    setLocations(randomLocations);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setRounds(0);
  };

  const endRound = (roundScore) => {
    const newScore = score + roundScore;
    setScore(newScore);
    
    const newRounds = rounds + 1;
    setRounds(newRounds);
    
    if (newRounds >= MAX_ROUNDS) {
      setGameState('end');
    }
  };

  const restartGame = () => {
    const randomLocations = generateRandomLocations(MAX_ROUNDS);
    setLocations(randomLocations);
    setGameState('start');
  };

  const generateRandomLocations = (count) => {
    // These regions are more likely to have good Mapillary coverage
    const regions = [
      // North America
      { minLat: 25, maxLat: 49, minLng: -125, maxLng: -66, weight: 10 },
      // Europe
      { minLat: 36, maxLat: 60, minLng: -10, maxLng: 30, weight: 10 },
      // Japan
      { minLat: 30, maxLat: 45, minLng: 130, maxLng: 145, weight: 5 },
      // Australia
      { minLat: -38, maxLat: -25, minLng: 115, maxLng: 153, weight: 3 },
      // South America
      { minLat: -34, maxLat: 10, minLng: -80, maxLng: -35, weight: 3 },
      // South Africa
      { minLat: -34, maxLat: -25, minLng: 18, maxLng: 32, weight: 2 },
    ];

    // Calculate total weight
    const totalWeight = regions.reduce((sum, region) => sum + region.weight, 0);
    
    // Generate 'count' number of locations
    const locations = [];
    for (let i = 0; i < count; i++) {
      // Pick a random region based on weight
      let randomValue = Math.random() * totalWeight;
      let selectedRegion = regions[0];
      
      for (const region of regions) {
        randomValue -= region.weight;
        if (randomValue <= 0) {
          selectedRegion = region;
          break;
        }
      }
      
      // Generate a random point within the selected region
      const lat = selectedRegion.minLat + Math.random() * (selectedRegion.maxLat - selectedRegion.minLat);
      const lng = selectedRegion.minLng + Math.random() * (selectedRegion.maxLng - selectedRegion.minLng);
      
      locations.push({ lat, lng });
    }
    
    return locations;
  };

  return (
    <div className="app-container">
      {gameState === 'start' && (
        <StartScreen onStart={startGame} />
      )}
      
      {gameState === 'playing' && (
        <Game 
          location={locations[rounds]} 
          onEndRound={endRound}
          roundNumber={rounds + 1}
          maxRounds={MAX_ROUNDS}
        />
      )}
      
      {gameState === 'end' && (
        <EndScreen 
          score={score} 
          maxScore={MAX_ROUNDS * 5000} 
          onRestart={restartGame} 
        />
      )}
    </div>
  );
}

export default App; 