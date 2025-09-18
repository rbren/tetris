import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the Tetris game header', () => {
    render(<App />)
    
    // Check for Tetris title in header
    expect(screen.getByRole('heading', { name: 'Tetris' })).toBeInTheDocument()
    
    // Check for header element
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the Tetris game board', () => {
    render(<App />)
    
    // Check for main content area
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check for game board elements (board cells should be present)
    const boardCells = document.querySelectorAll('.board-cell')
    expect(boardCells.length).toBe(200) // 10x20 board = 200 cells
  })

  it('renders the game info panel', () => {
    render(<App />)
    
    // Check for score, level, lines headings
    expect(screen.getByRole('heading', { name: 'Score' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Level' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lines' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Next' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Controls' })).toBeInTheDocument()
  })

  it('renders the controls instructions', () => {
    render(<App />)
    
    // Check for control instructions
    expect(screen.getByText('← → Move')).toBeInTheDocument()
    expect(screen.getByText('↓ Soft Drop')).toBeInTheDocument()
    expect(screen.getByText('↑ Rotate')).toBeInTheDocument()
    expect(screen.getByText('Space Hard Drop')).toBeInTheDocument()
    expect(screen.getByText('P Pause')).toBeInTheDocument()
    expect(screen.getByText('R Restart')).toBeInTheDocument()
  })

  it('has the correct CSS classes for styling', () => {
    const { container } = render(<App />)
    
    // Check for main app container
    expect(container.querySelector('.App')).toBeInTheDocument()
    expect(container.querySelector('.app-header')).toBeInTheDocument()
    expect(container.querySelector('.main-content')).toBeInTheDocument()
    expect(container.querySelector('.tetris-game')).toBeInTheDocument()
    expect(container.querySelector('.game-container')).toBeInTheDocument()
    expect(container.querySelector('.tetris-board')).toBeInTheDocument()
    expect(container.querySelector('.game-info')).toBeInTheDocument()
  })
})