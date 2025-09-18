import { describe, it, expect } from 'vitest'
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PIECES,
  createBoard,
  getRandomPiece,
  rotatePiece,
  isValidPosition,
  placePiece,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed
} from './tetris'

describe('Tetris Utils', () => {
  describe('Constants', () => {
    it('has correct board dimensions', () => {
      expect(BOARD_WIDTH).toBe(10)
      expect(BOARD_HEIGHT).toBe(20)
    })

    it('has all 7 Tetris pieces', () => {
      expect(Object.keys(PIECES)).toEqual(['I', 'O', 'T', 'S', 'Z', 'J', 'L'])
      
      // Check that each piece has shape and color
      Object.values(PIECES).forEach(piece => {
        expect(piece).toHaveProperty('shape')
        expect(piece).toHaveProperty('color')
        expect(Array.isArray(piece.shape)).toBe(true)
        expect(typeof piece.color).toBe('string')
      })
    })
  })

  describe('createBoard', () => {
    it('creates empty board with correct dimensions', () => {
      const board = createBoard()
      expect(board.length).toBe(BOARD_HEIGHT)
      expect(board[0].length).toBe(BOARD_WIDTH)
      
      // Check all cells are empty (0)
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBe(0)
        })
      })
    })
  })

  describe('getRandomPiece', () => {
    it('returns a valid piece object', () => {
      const piece = getRandomPiece()
      
      expect(piece).toHaveProperty('type')
      expect(piece).toHaveProperty('shape')
      expect(piece).toHaveProperty('color')
      expect(piece).toHaveProperty('x')
      expect(piece).toHaveProperty('y')
      
      expect(typeof piece.type).toBe('string')
      expect(Array.isArray(piece.shape)).toBe(true)
      expect(typeof piece.color).toBe('string')
      expect(typeof piece.x).toBe('number')
      expect(typeof piece.y).toBe('number')
    })

    it('returns pieces with valid types', () => {
      const validTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']
      
      // Test multiple times to increase chance of getting all pieces
      for (let i = 0; i < 20; i++) {
        const piece = getRandomPiece()
        expect(validTypes).toContain(piece.type)
      }
    })
  })

  describe('rotatePiece', () => {
    it('rotates T piece correctly', () => {
      const tPiece = {
        type: 'T',
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ],
        color: '#a000f0',
        x: 4,
        y: 0
      }
      
      const rotated = rotatePiece(tPiece)
      
      expect(rotated.shape).toEqual([
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ])
    })

    it('preserves piece properties except shape', () => {
      const piece = getRandomPiece()
      const rotated = rotatePiece(piece)
      
      expect(rotated.type).toBe(piece.type)
      expect(rotated.color).toBe(piece.color)
      expect(rotated.x).toBe(piece.x)
      expect(rotated.y).toBe(piece.y)
      expect(rotated.shape).not.toEqual(piece.shape) // Shape should change
    })
  })

  describe('isValidPosition', () => {
    const board = createBoard()
    const piece = {
      shape: [[1, 1], [1, 1]],
      x: 4,
      y: 0
    }

    it('returns true for valid position', () => {
      expect(isValidPosition(board, piece)).toBe(true)
    })

    it('returns false for position outside left boundary', () => {
      const invalidPiece = { ...piece, x: -1 }
      expect(isValidPosition(board, invalidPiece)).toBe(false)
    })

    it('returns false for position outside right boundary', () => {
      const invalidPiece = { ...piece, x: 9 }
      expect(isValidPosition(board, invalidPiece)).toBe(false)
    })

    it('returns false for position outside bottom boundary', () => {
      const invalidPiece = { ...piece, y: 19 }
      expect(isValidPosition(board, invalidPiece)).toBe(false)
    })

    it('returns false for collision with existing piece', () => {
      const boardWithPiece = createBoard()
      boardWithPiece[0][4] = '#ff0000'
      
      expect(isValidPosition(boardWithPiece, piece)).toBe(false)
    })
  })

  describe('placePiece', () => {
    it('places piece on board correctly', () => {
      const board = createBoard()
      const piece = {
        shape: [[1, 1], [1, 1]],
        color: '#f0f000',
        x: 4,
        y: 0
      }
      
      const newBoard = placePiece(board, piece)
      
      expect(newBoard[0][4]).toBe('#f0f000')
      expect(newBoard[0][5]).toBe('#f0f000')
      expect(newBoard[1][4]).toBe('#f0f000')
      expect(newBoard[1][5]).toBe('#f0f000')
      
      // Original board should be unchanged
      expect(board[0][4]).toBe(0)
    })
  })

  describe('clearLines', () => {
    it('clears completed lines', () => {
      const board = createBoard()
      // Fill bottom row completely
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = '#ff0000'
      }
      
      const result = clearLines(board)
      
      expect(result.linesCleared).toBe(1)
      expect(result.board[BOARD_HEIGHT - 1].every(cell => cell === 0)).toBe(true)
    })

    it('does not clear incomplete lines', () => {
      const board = createBoard()
      // Fill bottom row except one cell
      for (let x = 0; x < BOARD_WIDTH - 1; x++) {
        board[BOARD_HEIGHT - 1][x] = '#ff0000'
      }
      
      const result = clearLines(board)
      
      expect(result.linesCleared).toBe(0)
      expect(result.board[BOARD_HEIGHT - 1][0]).toBe('#ff0000')
    })
  })

  describe('calculateScore', () => {
    it('calculates score correctly for different line clears', () => {
      expect(calculateScore(0, 0)).toBe(0)
      expect(calculateScore(1, 0)).toBe(40)
      expect(calculateScore(2, 0)).toBe(100)
      expect(calculateScore(3, 0)).toBe(300)
      expect(calculateScore(4, 0)).toBe(1200)
    })

    it('applies level multiplier correctly', () => {
      expect(calculateScore(1, 1)).toBe(80) // 40 * (1 + 1)
      expect(calculateScore(1, 2)).toBe(120) // 40 * (2 + 1)
    })
  })

  describe('calculateLevel', () => {
    it('calculates level based on total lines', () => {
      expect(calculateLevel(0)).toBe(0)
      expect(calculateLevel(9)).toBe(0)
      expect(calculateLevel(10)).toBe(1)
      expect(calculateLevel(19)).toBe(1)
      expect(calculateLevel(20)).toBe(2)
    })
  })

  describe('getDropSpeed', () => {
    it('returns correct drop speed for different levels', () => {
      expect(getDropSpeed(0)).toBe(1000)
      expect(getDropSpeed(1)).toBe(950)
      expect(getDropSpeed(10)).toBe(500)
    })

    it('has minimum drop speed', () => {
      expect(getDropSpeed(100)).toBe(50) // Should not go below 50ms
    })
  })
})