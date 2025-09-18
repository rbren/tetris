"""Main FastAPI application for Tetris backend."""

from typing import Dict

from fastapi import FastAPI

app = FastAPI(
    title="Tetris Backend API",
    description="Backend API for the Tetris game application",
    version="0.1.0",
)


@app.get("/")
async def root() -> Dict[str, str]:
    """Root endpoint returning basic API information."""
    return {"message": "Tetris Backend API", "version": "0.1.0"}


@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/api/game/status")
async def game_status() -> Dict[str, str]:
    """Get current game status."""
    return {"status": "ready", "message": "Game backend is ready"}
