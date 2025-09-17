import PropTypes from 'prop-types'

function GameControls({ onRestart, onPause, isPaused, gameOver }) {
  return (
    <div className="game-controls">
      <h3>Controls</h3>
      <div className="control-buttons">
        <button 
          onClick={onRestart}
          className="control-btn restart-btn"
        >
          {gameOver ? 'New Game' : 'Restart'}
        </button>
        
        {!gameOver && (
          <button 
            onClick={onPause}
            className="control-btn pause-btn"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
      </div>
      
      <div className="control-instructions">
        <div className="instruction">
          <span className="key">←→</span>
          <span>Move</span>
        </div>
        <div className="instruction">
          <span className="key">↓</span>
          <span>Soft Drop</span>
        </div>
        <div className="instruction">
          <span className="key">↑</span>
          <span>Rotate</span>
        </div>
        <div className="instruction">
          <span className="key">Space</span>
          <span>Hard Drop</span>
        </div>
        <div className="instruction">
          <span className="key">P</span>
          <span>Pause</span>
        </div>
      </div>
    </div>
  )
}

GameControls.propTypes = {
  onRestart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  isPaused: PropTypes.bool.isRequired,
  gameOver: PropTypes.bool.isRequired
}

export default GameControls