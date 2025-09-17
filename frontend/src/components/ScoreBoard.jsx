import PropTypes from 'prop-types'

function ScoreBoard({ score, lines, level }) {
  return (
    <div className="score-board">
      <h3>Score</h3>
      <div className="score-item">
        <span className="label">Score:</span>
        <span className="value">{score.toLocaleString()}</span>
      </div>
      <div className="score-item">
        <span className="label">Lines:</span>
        <span className="value">{lines}</span>
      </div>
      <div className="score-item">
        <span className="label">Level:</span>
        <span className="value">{level}</span>
      </div>
    </div>
  )
}

ScoreBoard.propTypes = {
  score: PropTypes.number.isRequired,
  lines: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired
}

export default ScoreBoard