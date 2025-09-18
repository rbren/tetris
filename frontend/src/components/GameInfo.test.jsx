import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GameInfo from './GameInfo'

describe('GameInfo', () => {
  const mockProps = {
    score: 1500,
    level: 2,
    lines: 15,
    nextPiece: {
      shape: [
        [1, 1, 1],
        [0, 1, 0]
      ],
      color: '#a000f0'
    },
    gameOver: false,
    paused: false
  }

  it('renders score, level, and lines information', () => {
    render(<GameInfo {...mockProps} />)
    
    // Check for headings
    expect(screen.getByRole('heading', { name: 'Score' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Level' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lines' })).toBeInTheDocument()
    
    // Check for values
    expect(screen.getByText('1,500')).toBeInTheDocument() // Score with comma formatting
    expect(screen.getByText('2')).toBeInTheDocument() // Level
    expect(screen.getByText('15')).toBeInTheDocument() // Lines
  })

  it('renders next piece preview', () => {
    render(<GameInfo {...mockProps} />)
    
    expect(screen.getByRole('heading', { name: 'Next' })).toBeInTheDocument()
    
    // Check for next piece grid structure
    const { container } = render(<GameInfo {...mockProps} />)
    expect(container.querySelector('.next-piece-grid')).toBeInTheDocument()
    expect(container.querySelector('.next-piece-row')).toBeInTheDocument()
    expect(container.querySelector('.next-piece-cell')).toBeInTheDocument()
  })

  it('renders controls instructions', () => {
    render(<GameInfo {...mockProps} />)
    
    expect(screen.getByRole('heading', { name: 'Controls' })).toBeInTheDocument()
    expect(screen.getByText('← → Move')).toBeInTheDocument()
    expect(screen.getByText('↓ Soft Drop')).toBeInTheDocument()
    expect(screen.getByText('↑ Rotate')).toBeInTheDocument()
    expect(screen.getByText('Space Hard Drop')).toBeInTheDocument()
    expect(screen.getByText('P Pause')).toBeInTheDocument()
    expect(screen.getByText('R Restart')).toBeInTheDocument()
  })

  it('shows game over message when game is over', () => {
    const gameOverProps = { ...mockProps, gameOver: true }
    render(<GameInfo {...gameOverProps} />)
    
    expect(screen.getByText('Game Over!')).toBeInTheDocument()
    expect(screen.getByText('Press R to restart')).toBeInTheDocument()
  })

  it('shows paused message when game is paused', () => {
    const pausedProps = { ...mockProps, paused: true }
    render(<GameInfo {...pausedProps} />)
    
    expect(screen.getByText('Paused')).toBeInTheDocument()
    expect(screen.getByText('Press P to resume')).toBeInTheDocument()
  })

  it('does not show game status when game is running normally', () => {
    render(<GameInfo {...mockProps} />)
    
    expect(screen.queryByText('Game Over!')).not.toBeInTheDocument()
    expect(screen.queryByText('Paused')).not.toBeInTheDocument()
  })

  it('handles null next piece', () => {
    const propsWithoutNextPiece = { ...mockProps, nextPiece: null }
    render(<GameInfo {...propsWithoutNextPiece} />)
    
    // Should still render the Next section but without piece
    expect(screen.getByRole('heading', { name: 'Next' })).toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    const { container } = render(<GameInfo {...mockProps} />)
    
    expect(container.querySelector('.game-info')).toBeInTheDocument()
    expect(container.querySelector('.score-section')).toBeInTheDocument()
    expect(container.querySelector('.level-section')).toBeInTheDocument()
    expect(container.querySelector('.lines-section')).toBeInTheDocument()
    expect(container.querySelector('.next-piece-section')).toBeInTheDocument()
    expect(container.querySelector('.controls')).toBeInTheDocument()
  })
})