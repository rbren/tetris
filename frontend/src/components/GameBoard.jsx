import PropTypes from 'prop-types'

function GameBoard({ board, gameOver, isPaused }) {
  return (
    <div className="game-board-container">
      <div className="game-board">
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`cell ${cell ? `filled ${cell}` : 'empty'}`}
            />
          ))
        )}
      </div>
      
      {(gameOver || isPaused) && (
        <div className="game-overlay">
          <div className="overlay-content">
            {gameOver ? (
              <>
                <h2>Game Over</h2>
                <p>Press Restart to play again</p>
              </>
            ) : (
              <>
                <h2>Paused</h2>
                <p>Press P to continue</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

GameBoard.propTypes = {
  board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  gameOver: PropTypes.bool.isRequired,
  isPaused: PropTypes.bool.isRequired
}

export default GameBoard