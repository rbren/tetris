import { useState, useEffect, useCallback } from 'react'
import GameBoard from './GameBoard'
import ScoreBoard from './ScoreBoard'
import NextPiece from './NextPiece'
import GameControls from './GameControls'

// Tetris pieces (tetrominoes)
const PIECES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 'cyan'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'yellow'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'purple'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 'green'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 'red'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'blue'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'orange'
  }
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_DROP_TIME = 1000

function TetrisGame() {
  const [board, setBoard] = useState(() => 
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null))
  )
  const [currentPiece, setCurrentPiece] = useState(null)
  const [nextPiece, setNextPiece] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [dropTime, setDropTime] = useState(INITIAL_DROP_TIME)

  // Generate random piece
  const generatePiece = useCallback(() => {
    const pieces = Object.keys(PIECES)
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    return {
      type: randomPiece,
      shape: PIECES[randomPiece].shape,
      color: PIECES[randomPiece].color
    }
  }, [])

  // Initialize game
  const initGame = useCallback(() => {
    const newBoard = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null))
    setBoard(newBoard)
    setCurrentPiece(generatePiece())
    setNextPiece(generatePiece())
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 })
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameOver(false)
    setIsPaused(false)
    setDropTime(INITIAL_DROP_TIME)
  }, [generatePiece])

  // Check if position is valid
  const isValidPosition = useCallback((piece, pos, gameBoard = board) => {
    if (!piece) return false
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x
          const newY = pos.y + y
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false
          }
          
          if (newY >= 0 && gameBoard[newY][newX]) {
            return false
          }
        }
      }
    }
    return true
  }, [board])

  // Rotate piece
  const rotatePiece = useCallback((piece) => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    )
    return { ...piece, shape: rotated }
  }, [])

  // Place piece on board
  const placePiece = useCallback((piece, pos, gameBoard) => {
    const newBoard = gameBoard.map(row => [...row])
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = pos.y + y
          const boardX = pos.x + x
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color
          }
        }
      }
    }
    
    return newBoard
  }, [])

  // Clear completed lines
  const clearLines = useCallback((gameBoard) => {
    const newBoard = []
    let linesCleared = 0
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (gameBoard[y].every(cell => cell !== null)) {
        linesCleared++
      } else {
        newBoard.unshift(gameBoard[y])
      }
    }
    
    // Add empty lines at top
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null))
    }
    
    return { board: newBoard, linesCleared }
  }, [])

  // Move piece
  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece || gameOver || isPaused) return
    
    const newPosition = { x: position.x + dx, y: position.y + dy }
    
    if (isValidPosition(currentPiece, newPosition)) {
      setPosition(newPosition)
    } else if (dy > 0) {
      // Piece hit bottom, place it
      const newBoard = placePiece(currentPiece, position, board)
      const { board: clearedBoard, linesCleared } = clearLines(newBoard)
      
      setBoard(clearedBoard)
      setLines(prev => prev + linesCleared)
      setScore(prev => prev + linesCleared * 100 * level + 10)
      
      // Check for game over
      const newPiece = nextPiece
      const startPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }
      
      if (!isValidPosition(newPiece, startPosition, clearedBoard)) {
        setGameOver(true)
        return
      }
      
      setCurrentPiece(newPiece)
      setNextPiece(generatePiece())
      setPosition(startPosition)
      
      // Increase level every 10 lines
      const newLevel = Math.floor((lines + linesCleared) / 10) + 1
      if (newLevel > level) {
        setLevel(newLevel)
        setDropTime(Math.max(100, INITIAL_DROP_TIME - (newLevel - 1) * 100))
      }
    }
  }, [currentPiece, position, board, gameOver, isPaused, isValidPosition, placePiece, clearLines, nextPiece, generatePiece, lines, level])

  // Rotate current piece
  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    
    const rotated = rotatePiece(currentPiece)
    if (isValidPosition(rotated, position)) {
      setCurrentPiece(rotated)
    }
  }, [currentPiece, position, gameOver, isPaused, rotatePiece, isValidPosition])

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return
    
    let dropDistance = 0
    while (isValidPosition(currentPiece, { x: position.x, y: position.y + dropDistance + 1 })) {
      dropDistance++
    }
    
    setPosition(prev => ({ ...prev, y: prev.y + dropDistance }))
    setScore(prev => prev + dropDistance * 2)
    
    // Trigger placement on next frame
    setTimeout(() => movePiece(0, 1), 0)
  }, [currentPiece, position, gameOver, isPaused, isValidPosition, movePiece])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          movePiece(-1, 0)
          break
        case 'ArrowRight':
          e.preventDefault()
          movePiece(1, 0)
          break
        case 'ArrowDown':
          e.preventDefault()
          movePiece(0, 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          rotatePieceHandler()
          break
        case ' ':
          e.preventDefault()
          hardDrop()
          break
        case 'p':
        case 'P':
          e.preventDefault()
          setIsPaused(prev => !prev)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [movePiece, rotatePieceHandler, hardDrop, gameOver])

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return

    const gameLoop = setInterval(() => {
      movePiece(0, 1)
    }, dropTime)

    return () => clearInterval(gameLoop)
  }, [movePiece, dropTime, gameOver, isPaused])

  // Initialize game on mount
  useEffect(() => {
    initGame()
  }, [initGame])

  // Create display board with current piece
  const displayBoard = board.map(row => [...row])
  if (currentPiece && !gameOver) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = position.y + y
          const boardX = position.x + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = currentPiece.color
          }
        }
      }
    }
  }

  return (
    <div className="tetris-game">
      <div className="game-header">
        <h1 className="game-title">TETRIS</h1>
      </div>
      
      <div className="game-container">
        <div className="game-info">
          <ScoreBoard 
            score={score}
            lines={lines}
            level={level}
          />
          <NextPiece piece={nextPiece} />
        </div>
        
        <div className="game-main">
          <GameBoard 
            board={displayBoard}
            gameOver={gameOver}
            isPaused={isPaused}
          />
        </div>
        
        <div className="game-controls">
          <GameControls 
            onRestart={initGame}
            onPause={() => setIsPaused(!isPaused)}
            isPaused={isPaused}
            gameOver={gameOver}
          />
        </div>
      </div>
      
      <div className="game-instructions">
        <p>Use arrow keys to move and rotate pieces</p>
        <p>Spacebar for hard drop • P to pause</p>
      </div>
    </div>
  )
}

export default TetrisGame