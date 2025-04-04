import React from 'react';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="start-container">
        <h1>GeoGuessr Clone</h1>
        <p>Test your geography knowledge! You'll be dropped at random locations around the world.</p>
        <p>Look around in Street View, then make your best guess on the map.</p>
        <p>The closer your guess, the more points you'll earn. Good luck!</p>
        <button className="start-btn" onClick={onStart}>Start Game</button>
      </div>
    </div>
  );
}

export default StartScreen; 