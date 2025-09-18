"""Pydantic models for the Tetris backend API."""

from typing import Optional

from pydantic import BaseModel


class GameState(BaseModel):
    """Represents the current state of a Tetris game."""

    score: int = 0
    level: int = 1
    lines_cleared: int = 0
    is_game_over: bool = False
    current_piece: Optional[str] = None


class Player(BaseModel):
    """Represents a player in the Tetris game."""

    id: str
    name: str
    high_score: int = 0


class GameSession(BaseModel):
    """Represents a game session."""

    session_id: str
    player: Player
    game_state: GameState
    created_at: str
