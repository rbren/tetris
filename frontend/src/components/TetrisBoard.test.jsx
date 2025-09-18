import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TetrisBoard from './TetrisBoard'

describe('TetrisBoard', () => {
  const mockBoard = Array(20).fill().map(() => Array(10).fill(0))
  
  const mockPiece = {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000',
    x: 4,
    y: 0
  }

  it('renders the game board with correct number of cells', () => {
    const { container } = render(<TetrisBoard board={mockBoard} currentPiece={null} />)
    
    // Check for board container
    expect(container.querySelector('.tetris-board')).toBeInTheDocument()
    
    // Check for correct number of rows and cells
    const rows = container.querySelectorAll('.board-row')
    expect(rows.length).toBe(20)
    
    const cells = container.querySelectorAll('.board-cell')
    expect(cells.length).toBe(200) // 20 rows × 10 columns
  })

  it('renders board without current piece', () => {
    const { container } = render(<TetrisBoard board={mockBoard} currentPiece={null} />)
    
    const cells = container.querySelectorAll('.board-cell')
    cells.forEach(cell => {
      // All cells should have default background color
      expect(cell.style.backgroundColor).toBe('rgb(26, 26, 26)')
    })
  })

  it('renders board with current piece overlay', () => {
    const { container } = render(<TetrisBoard board={mockBoard} currentPiece={mockPiece} />)
    
    // Should still have correct structure
    expect(container.querySelector('.tetris-board')).toBeInTheDocument()
    expect(container.querySelectorAll('.board-cell').length).toBe(200)
  })

  it('renders board with placed pieces', () => {
    const boardWithPieces = mockBoard.map(row => [...row])
    boardWithPieces[19][0] = '#ff0000' // Red piece at bottom
    boardWithPieces[19][1] = '#ff0000'
    
    const { container } = render(<TetrisBoard board={boardWithPieces} currentPiece={null} />)
    
    const cells = container.querySelectorAll('.board-cell')
    // Check that some cells have the piece color
    const bottomRowCells = Array.from(cells).slice(190, 200) // Last row
    expect(bottomRowCells[0].style.backgroundColor).toBe('rgb(255, 0, 0)')
    expect(bottomRowCells[1].style.backgroundColor).toBe('rgb(255, 0, 0)')
  })

  it('has correct CSS classes', () => {
    const { container } = render(<TetrisBoard board={mockBoard} currentPiece={null} />)
    
    expect(container.querySelector('.tetris-board')).toBeInTheDocument()
    expect(container.querySelector('.board-row')).toBeInTheDocument()
    expect(container.querySelector('.board-cell')).toBeInTheDocument()
  })
})