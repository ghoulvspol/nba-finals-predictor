"""
2026 NBA Finals Predictor - FastAPI Application
"""

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse

from team_data import TEAMS, SERIES, FINALS_GAMES, PLAYERS, HISTORICAL
from prediction_engine import (
    predict_game,
    simulate_series,
    get_pregame_analysis,
    get_player_matchups,
    compute_team_strength,
    compute_player_impact,
)

app = FastAPI(title="2026 NBA Finals Predictor")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


@app.get("/")
async def index(request: Request):
    series = SERIES.copy()

    predictions = []
    for game in FINALS_GAMES:
        if game["score"] is None:
            pred = predict_game(game["game"])
            predictions.append({
                "game": game["game"],
                "date": game["date"],
                "location": game["location"],
                "home": game["home"],
                "away": game["away"],
                "home_win_prob": round(pred.home_win_prob * 100, 1),
                "away_win_prob": round(pred.away_win_prob * 100, 1),
                "predicted_home_score": pred.predicted_home_score,
                "predicted_away_score": pred.predicted_away_score,
                "key_factors": pred.key_factors,
                "player_insights": pred.player_insights,
            })

    sim = simulate_series(10000)
    spurs_stats = TEAMS["spurs"]["stats"]
    knicks_stats = TEAMS["knicks"]["stats"]
    analysis = get_pregame_analysis()

    # Player impact data
    spurs_impact = compute_player_impact("spurs", "finals")
    knicks_impact = compute_player_impact("knicks", "finals")

    return templates.TemplateResponse("index.html", {
        "request": request,
        "series": series,
        "games": FINALS_GAMES,
        "predictions": predictions,
        "simulation": {
            "spurs_win_prob": round(sim.spurs_win_prob * 100, 1),
            "knicks_win_prob": round(sim.knicks_win_prob * 100, 1),
            "most_likely": sim.most_likely_outcome,
            "avg_games": round(sim.average_games, 1),
            "outcome_probs": {k: round(v * 100, 1) for k, v in sim.outcome_probabilities.items()},
        },
        "teams": TEAMS,
        "spurs_stats": spurs_stats,
        "knicks_stats": knicks_stats,
        "analysis": analysis,
        "historical": HISTORICAL,
        "spurs_impact": spurs_impact,
        "knicks_impact": knicks_impact,
    })


@app.get("/predictions")
async def predictions_page(request: Request):
    game_predictions = []
    for game in FINALS_GAMES:
        if game["score"] is None:
            pred = predict_game(game["game"])
            game_predictions.append({
                "game": game["game"],
                "date": game["date"],
                "location": game["location"],
                "home": game["home"],
                "away": game["away"],
                "home_win_prob": round(pred.home_win_prob * 100, 1),
                "away_win_prob": round(pred.away_win_prob * 100, 1),
                "predicted_home_score": pred.predicted_home_score,
                "predicted_away_score": pred.predicted_away_score,
                "key_factors": pred.key_factors,
                "player_insights": pred.player_insights,
            })

    scenarios = []
    pred_g4_spurs_win = predict_game(4, spurs_wins=1, knicks_wins=2)
    scenarios.append({
        "condition": "If Spurs win Game 3",
        "series_state": "1-2",
        "next_game_prob": round(pred_g4_spurs_win.home_win_prob * 100, 1),
        "note": "Spurs gain momentum, series shifts to San Antonio",
    })
    pred_g4_knicks_win = predict_game(4, spurs_wins=0, knicks_wins=3)
    scenarios.append({
        "condition": "If Knicks win Game 3",
        "series_state": "0-3",
        "next_game_prob": round(pred_g4_knicks_win.home_win_prob * 100, 1),
        "note": "Knicks can sweep at 3-0 (no team has ever come back from 0-3)",
    })

    return templates.TemplateResponse("predictions.html", {
        "request": request,
        "predictions": game_predictions,
        "scenarios": scenarios,
        "series": SERIES,
        "games": FINALS_GAMES,
        "teams": TEAMS,
    })


@app.get("/players")
async def players_page(request: Request):
    matchups = get_player_matchups()
    spurs_impact = compute_player_impact("spurs", "finals")
    knicks_impact = compute_player_impact("knicks", "finals")

    return templates.TemplateResponse("players.html", {
        "request": request,
        "matchups": matchups,
        "spurs_players": PLAYERS["spurs"],
        "knicks_players": PLAYERS["knicks"],
        "teams": TEAMS,
        "series": SERIES,
        "spurs_impact": spurs_impact,
        "knicks_impact": knicks_impact,
    })


@app.get("/simulator")
async def simulator_page(request: Request):
    sim = simulate_series(10000)
    return templates.TemplateResponse("simulator.html", {
        "request": request,
        "simulation": {
            "spurs_win_prob": round(sim.spurs_win_prob * 100, 1),
            "knicks_win_prob": round(sim.knicks_win_prob * 100, 1),
            "most_likely": sim.most_likely_outcome,
            "avg_games": round(sim.average_games, 1),
            "outcome_probs": {k: round(v * 100, 1) for k, v in sim.outcome_probabilities.items()},
        },
        "series": SERIES,
        "teams": TEAMS,
    })


@app.get("/api/simulate")
async def api_simulate(n: int = 10000):
    sim = simulate_series(min(n, 100000))
    return JSONResponse({
        "spurs_win_prob": round(sim.spurs_win_prob * 100, 2),
        "knicks_win_prob": round(sim.knicks_win_prob * 100, 2),
        "most_likely_outcome": sim.most_likely_outcome,
        "average_games": round(sim.average_games, 1),
        "outcome_probabilities": {k: round(v * 100, 2) for k, v in sim.outcome_probabilities.items()},
    })


@app.get("/api/predict/{game_number}")
async def api_predict_game(game_number: int):
    if game_number < 1 or game_number > 7:
        return JSONResponse({"error": "Game number must be 1-7"}, status_code=400)

    pred = predict_game(game_number)
    return JSONResponse({
        "game": game_number,
        "home_team": pred.home_team,
        "away_team": pred.away_team,
        "home_win_prob": round(pred.home_win_prob * 100, 2),
        "away_win_prob": round(pred.away_win_prob * 100, 2),
        "predicted_score": f"{pred.predicted_home_score}-{pred.predicted_away_score}",
        "key_factors": pred.key_factors,
        "player_insights": pred.player_insights,
    })


@app.get("/api/player-impact")
async def api_player_impact():
    """API endpoint for player impact analysis."""
    spurs = compute_player_impact("spurs", "finals")
    knicks = compute_player_impact("knicks", "finals")
    return JSONResponse({
        "spurs": {"team_impact": spurs["team_impact"], "players": spurs["insights"]},
        "knicks": {"team_impact": knicks["team_impact"], "players": knicks["insights"]},
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
