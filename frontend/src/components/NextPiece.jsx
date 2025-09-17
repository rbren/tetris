import PropTypes from 'prop-types'

function NextPiece({ piece }) {
  if (!piece) return null

  return (
    <div className="next-piece">
      <h3>Next</h3>
      <div className="next-piece-grid">
        {piece.shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`next-cell ${cell ? `filled ${piece.color}` : 'empty'}`}
            />
          ))
        )}
      </div>
    </div>
  )
}

NextPiece.propTypes = {
  piece: PropTypes.shape({
    shape: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    color: PropTypes.string.isRequired
  })
}

export default NextPiece