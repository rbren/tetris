# Tetris Backend API

A FastAPI-based backend for the Tetris game application.

## Features

- RESTful API endpoints for game management
- Health check endpoints
- Pydantic models for data validation
- Comprehensive test coverage

## Development

### Setup

```bash
cd backend
pip install -e ".[dev]"
```

### Running Tests

```bash
pytest
```

### Code Quality

```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

## API Endpoints

- `GET /` - Root endpoint with API information
- `GET /health` - Health check
- `GET /api/game/status` - Game status endpoint