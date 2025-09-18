import React from 'react';

const GameInfo = ({ score, level, lines, nextPiece, gameOver, paused }) => {
  return (
    <div className="game-info">
      <div className="score-section">
        <h3>Score</h3>
        <div className="score-value">{score.toLocaleString()}</div>
      </div>
      
      <div className="level-section">
        <h3>Level</h3>
        <div className="level-value">{level}</div>
      </div>
      
      <div className="lines-section">
        <h3>Lines</h3>
        <div className="lines-value">{lines}</div>
      </div>
      
      <div className="next-piece-section">
        <h3>Next</h3>
        <div className="next-piece">
          {nextPiece && (
            <div className="next-piece-grid">
              {nextPiece.shape.map((row, y) => (
                <div key={y} className="next-piece-row">
                  {row.map((cell, x) => (
                    <div
                      key={x}
                      className="next-piece-cell"
                      style={{
                        backgroundColor: cell ? nextPiece.color : 'transparent',
                        border: cell ? '1px solid #333' : 'none'
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {gameOver && (
        <div className="game-status game-over">
          <h2>Game Over!</h2>
          <p>Press R to restart</p>
        </div>
      )}
      
      {paused && !gameOver && (
        <div className="game-status paused">
          <h2>Paused</h2>
          <p>Press P to resume</p>
        </div>
      )}
      
      <div className="controls">
        <h3>Controls</h3>
        <div className="control-list">
          <div>← → Move</div>
          <div>↓ Soft Drop</div>
          <div>↑ Rotate</div>
          <div>Space Hard Drop</div>
          <div>P Pause</div>
          <div>R Restart</div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;