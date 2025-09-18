import React, { useState, useEffect, useCallback } from 'react';
import TetrisBoard from './TetrisBoard';
import GameInfo from './GameInfo';
import {
  createBoard,
  getRandomPiece,
  rotatePiece,
  isValidPosition,
  placePiece,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed
} from '../utils/tetris';

const TetrisGame = () => {
  const [board, setBoard] = useState(createBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dropTime, setDropTime] = useState(null);

  // Initialize game
  const initGame = useCallback(() => {
    const newBoard = createBoard();
    const firstPiece = getRandomPiece();
    const secondPiece = getRandomPiece();
    
    setBoard(newBoard);
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setScore(0);
    setLines(0);
    setLevel(0);
    setGameOver(false);
    setPaused(false);
    setDropTime(Date.now());
  }, []);

  // Move piece
  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece || gameOver || paused) return false;
    
    if (isValidPosition(board, currentPiece, dx, dy)) {
      setCurrentPiece(prev => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy
      }));
      return true;
    }
    return false;
  }, [board, currentPiece, gameOver, paused]);

  // Rotate piece
  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || gameOver || paused) return;
    
    const rotated = rotatePiece(currentPiece);
    if (isValidPosition(board, rotated)) {
      setCurrentPiece(rotated);
    }
  }, [board, currentPiece, gameOver, paused]);

  // Hard drop
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || paused) return;
    
    let dropDistance = 0;
    while (isValidPosition(board, currentPiece, 0, dropDistance + 1)) {
      dropDistance++;
    }
    
    if (dropDistance > 0) {
      setCurrentPiece(prev => ({
        ...prev,
        y: prev.y + dropDistance
      }));
    }
  }, [board, currentPiece, gameOver, paused]);

  // Lock piece and spawn new one
  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newBoard = placePiece(board, currentPiece);
    const { board: clearedBoard, linesCleared } = clearLines(newBoard);
    
    const newLines = lines + linesCleared;
    const newLevel = calculateLevel(newLines);
    const newScore = score + calculateScore(linesCleared, level);
    
    setBoard(clearedBoard);
    setLines(newLines);
    setLevel(newLevel);
    setScore(newScore);
    
    // Spawn next piece
    const newPiece = nextPiece;
    const nextNewPiece = getRandomPiece();
    
    if (isValidPosition(clearedBoard, newPiece)) {
      setCurrentPiece(newPiece);
      setNextPiece(nextNewPiece);
    } else {
      setGameOver(true);
    }
  }, [board, currentPiece, nextPiece, lines, level, score]);

  // Game loop
  useEffect(() => {
    if (gameOver || paused || !currentPiece) return;
    
    const dropSpeed = getDropSpeed(level);
    
    const gameLoop = () => {
      const now = Date.now();
      if (now - dropTime > dropSpeed) {
        if (!movePiece(0, 1)) {
          lockPiece();
        }
        setDropTime(now);
      }
    };
    
    const intervalId = setInterval(gameLoop, 50);
    return () => clearInterval(intervalId);
  }, [dropTime, level, movePiece, lockPiece, gameOver, paused, currentPiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver && e.key.toLowerCase() === 'r') {
        initGame();
        return;
      }
      
      if (e.key.toLowerCase() === 'p') {
        setPaused(prev => !prev);
        return;
      }
      
      if (paused || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (movePiece(0, 1)) {
            setDropTime(Date.now());
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePieceHandler();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, rotatePieceHandler, hardDrop, initGame, gameOver, paused]);

  // Initialize game on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    <div className="tetris-game">
      <div className="game-container">
        <TetrisBoard board={board} currentPiece={currentPiece} />
        <GameInfo
          score={score}
          level={level}
          lines={lines}
          nextPiece={nextPiece}
          gameOver={gameOver}
          paused={paused}
        />
      </div>
    </div>
  );
};

export default TetrisGame;