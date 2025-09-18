// Tetris game constants and utilities

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Tetris piece shapes
export const PIECES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '#00f0f0'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#a000f0'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: '#f00000'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#0000f0'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: '#f0a000'
  }
};

export const PIECE_TYPES = Object.keys(PIECES);

// Create empty board
export const createBoard = () => {
  return Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
};

// Get random piece
export const getRandomPiece = () => {
  const pieceType = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return {
    type: pieceType,
    shape: PIECES[pieceType].shape,
    color: PIECES[pieceType].color,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(PIECES[pieceType].shape[0].length / 2),
    y: 0
  };
};

// Rotate piece 90 degrees clockwise
export const rotatePiece = (piece) => {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  return { ...piece, shape: rotated };
};

// Check if piece position is valid
export const isValidPosition = (board, piece, dx = 0, dy = 0) => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.x + x + dx;
        const newY = piece.y + y + dy;
        
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }
        
        if (newY >= 0 && board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
};

// Place piece on board
export const placePiece = (board, piece) => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return newBoard;
};

// Clear completed lines
export const clearLines = (board) => {
  const newBoard = [];
  let linesCleared = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== 0)) {
      linesCleared++;
    } else {
      newBoard.unshift(board[y]);
    }
  }
  
  // Add empty lines at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }
  
  return { board: newBoard, linesCleared };
};

// Calculate score based on lines cleared
export const calculateScore = (linesCleared, level) => {
  const baseScores = [0, 40, 100, 300, 1200];
  return baseScores[linesCleared] * (level + 1);
};

// Calculate level based on lines cleared
export const calculateLevel = (totalLines) => {
  return Math.floor(totalLines / 10);
};

// Calculate drop speed based on level
export const getDropSpeed = (level) => {
  return Math.max(50, 1000 - (level * 50));
};