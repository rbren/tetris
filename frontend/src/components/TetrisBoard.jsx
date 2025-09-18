import React from 'react';

const TetrisBoard = ({ board, currentPiece }) => {
  // Create display board with current piece overlaid
  const displayBoard = board.map(row => [...row]);
  
  // Add current piece to display board
  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
            displayBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
  }

  return (
    <div className="tetris-board">
      {displayBoard.map((row, y) => (
        <div key={y} className="board-row">
          {row.map((cell, x) => (
            <div
              key={x}
              className="board-cell"
              style={{
                backgroundColor: cell || '#1a1a1a',
                border: '1px solid #333'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TetrisBoard;