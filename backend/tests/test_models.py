"""Tests for Pydantic models."""

from tetris_backend.models import GameState, Player, GameSession


def test_game_state_creation() -> None:
    """Test GameState model creation."""
    game_state = GameState()
    assert game_state.score == 0
    assert game_state.level == 1
    assert game_state.lines_cleared == 0
    assert game_state.is_game_over is False
    assert game_state.current_piece is None


def test_game_state_with_values() -> None:
    """Test GameState model with custom values."""
    game_state = GameState(
        score=1000,
        level=5,
        lines_cleared=20,
        is_game_over=True,
        current_piece="T",
    )
    assert game_state.score == 1000
    assert game_state.level == 5
    assert game_state.lines_cleared == 20
    assert game_state.is_game_over is True
    assert game_state.current_piece == "T"


def test_player_creation() -> None:
    """Test Player model creation."""
    player = Player(id="player1", name="Test Player")
    assert player.id == "player1"
    assert player.name == "Test Player"
    assert player.high_score == 0


def test_player_with_high_score() -> None:
    """Test Player model with high score."""
    player = Player(id="player1", name="Test Player", high_score=5000)
    assert player.high_score == 5000


def test_game_session_creation() -> None:
    """Test GameSession model creation."""
    player = Player(id="player1", name="Test Player")
    game_state = GameState()
    session = GameSession(
        session_id="session1",
        player=player,
        game_state=game_state,
        created_at="2023-01-01T00:00:00Z",
    )
    assert session.session_id == "session1"
    assert session.player.id == "player1"
    assert session.game_state.score == 0
    assert session.created_at == "2023-01-01T00:00:00Z"
