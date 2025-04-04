import React from 'react';

function EndScreen({ score, maxScore, onRestart }) {
  const percentage = Math.round((score / maxScore) * 100);
  
  let message = '';
  if (percentage >= 90) {
    message = 'Amazing! You\'re a geography master!';
  } else if (percentage >= 70) {
    message = 'Great job! You really know your way around the world!';
  } else if (percentage >= 50) {
    message = 'Not bad! You have a good sense of geography!';
  } else if (percentage >= 30) {
    message = 'Decent effort! Keep exploring to improve!';
  } else {
    message = 'Keep practicing! The world is a big place to learn about!';
  }

  return (
    <div className="end-screen">
      <div className="end-container">
        <h1>Game Over!</h1>
        <h2>Final Score: {score} / {maxScore}</h2>
        <h3>{percentage}%</h3>
        <p>{message}</p>
        <button className="restart-btn" onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
}

export default EndScreen; 