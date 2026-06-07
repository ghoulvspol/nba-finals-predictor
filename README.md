# 2026 NBA Finals Predictor 🏀

> AI-powered predictions for the 2026 NBA Finals: San Antonio Spurs vs New York Knicks

## Overview

A local web application that predicts the 2026 NBA Finals using:
- **Elo Rating System** with home court and playoff adjustments
- **Team Statistics** (offensive/defensive efficiency, pace, shooting)
- **Monte Carlo Simulation** (10,000 series simulations)
- **Series Context** (momentum, desperation, close-out pressure)

**Current Series: Knicks lead 2-0**

## Quick Start

```bash
# Navigate to project
cd nba-finals-predictor

# Start server
python3 -m uvicorn app:app --reload

# Open in browser
open http://localhost:8000
```

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Series Overview | `/` | Dashboard with series state, probabilities, predictions |
| Predictions | `/predictions` | Game-by-game predictions with key factors |
| Players | `/players` | Player data, matchups, and comparison charts |
| Simulator | `/simulator` | Monte Carlo simulation with outcome distribution |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/simulate?n=10000` | Run Monte Carlo simulation |
| `GET /api/predict/{game}` | Get prediction for specific game |

## Tech Stack

- **Backend**: Python 3, FastAPI, Jinja2
- **Frontend**: HTML, CSS (dark sports theme), Chart.js
- **Data**: Built-in team/player data (no external API needed)

## Prediction Model

The model combines multiple factors:

1. **Elo Ratings** (base: Spurs 1585, Knicks 1625)
   - Home court: +100 Elo points
   - Playoff bonus: +50 Elo points

2. **Team Strength Score**
   - Offensive Rating (35% weight)
   - Defensive Rating (30% weight)
   - Net Rating (20% weight)
   - True Shooting % (10% weight)
   - Pace adjustment (5% weight)

3. **Series Context**
   - Momentum factor (win/loss streak)
   - Desperation factor (elimination games)
   - Close-out pressure

4. **Historical Context**
   - Spurs 5-0 all-time in Finals
   - 0-2 comeback rate: 5.7%

## Project Structure

```
nba-finals-predictor/
├── app.py                    # FastAPI application
├── prediction_engine.py      # Prediction model
├── team_data.py              # Team/player data
├── requirements.txt          # Dependencies
├── static/
│   ├── css/style.css         # Dark sports theme
│   └── js/
│       ├── charts.js         # Chart.js configurations
│       └── main.js           # UI interactions
├── templates/
│   ├── base.html             # Base layout
│   ├── index.html            # Series overview
│   ├── predictions.html      # Game predictions
│   ├── players.html          # Player matchups
│   └── simulator.html        # Monte Carlo simulator
└── README.md
```

## Sample API Response

```json
{
  "spurs_win_prob": 8.44,
  "knicks_win_prob": 91.56,
  "most_likely_outcome": "2-4",
  "average_games": 5.5,
  "outcome_probabilities": {
    "0-4": 24.8,
    "1-4": 23.88,
    "2-4": 28.46,
    "3-4": 14.42,
    "4-2": 3.56,
    "4-3": 4.88
  }
}
```
