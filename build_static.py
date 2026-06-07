"""
Build static HTML files for GitHub Pages deployment.
Generates all pages with data baked in, simulation runs in JavaScript.
"""

import json
import os
import shutil
from jinja2 import Environment, FileSystemLoader

from team_data import TEAMS, SERIES, FINALS_GAMES, PLAYERS, HISTORICAL, PLAYER_IMPACT_WEIGHTS
from prediction_engine import (
    predict_game, simulate_series, get_pregame_analysis,
    get_player_matchups, compute_player_impact,
)

OUTPUT_DIR = "docs"


def build():
    # Clean output
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Copy static files
    shutil.copytree("static", os.path.join(OUTPUT_DIR, "static"))

    # Setup Jinja2
    env = Environment(loader=FileSystemLoader("templates"))

    # === Pre-compute all data ===
    # Predictions for remaining games
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

    # Simulation
    sim = simulate_series(10000)
    simulation = {
        "spurs_win_prob": round(sim.spurs_win_prob * 100, 1),
        "knicks_win_prob": round(sim.knicks_win_prob * 100, 1),
        "most_likely": sim.most_likely_outcome,
        "avg_games": round(sim.average_games, 1),
        "outcome_probs": {k: round(v * 100, 1) for k, v in sim.outcome_probabilities.items()},
    }

    # Analysis
    analysis = get_pregame_analysis()

    # Player impacts
    spurs_impact = compute_player_impact("spurs", "finals")
    knicks_impact = compute_player_impact("knicks", "finals")

    # Matchups
    matchups = get_player_matchups()

    # Scenarios
    pred_g4_spurs_win = predict_game(4, spurs_wins=1, knicks_wins=2)
    pred_g4_knicks_win = predict_game(4, spurs_wins=0, knicks_wins=3)
    scenarios = [
        {
            "condition": "If Spurs win Game 3",
            "series_state": "1-2",
            "next_game_prob": round(pred_g4_spurs_win.home_win_prob * 100, 1),
            "note": "Spurs gain momentum, series shifts to San Antonio",
        },
        {
            "condition": "If Knicks win Game 3",
            "series_state": "0-3",
            "next_game_prob": round(pred_g4_knicks_win.home_win_prob * 100, 1),
            "note": "Knicks can sweep at 3-0 (no team has ever come back from 0-3)",
        },
    ]

    # Common context
    common = {
        "series": SERIES,
        "games": FINALS_GAMES,
        "teams": TEAMS,
        "spurs_stats": TEAMS["spurs"]["stats"],
        "knicks_stats": TEAMS["knicks"]["stats"],
        "historical": HISTORICAL,
        "spurs_impact": spurs_impact,
        "knicks_impact": knicks_impact,
        "is_static": True,
    }

    # === Render pages ===
    pages = [
        {
            "template": "index.html",
            "output": "index.html",
            "extra": {
                "predictions": predictions,
                "simulation": simulation,
                "analysis": analysis,
            },
        },
        {
            "template": "predictions.html",
            "output": "predictions.html",
            "extra": {
                "predictions": predictions,
                "scenarios": scenarios,
            },
        },
        {
            "template": "players.html",
            "output": "players.html",
            "extra": {
                "matchups": matchups,
                "spurs_players": PLAYERS["spurs"],
                "knicks_players": PLAYERS["knicks"],
            },
        },
        {
            "template": "simulator.html",
            "output": "simulator.html",
            "extra": {
                "simulation": simulation,
            },
        },
    ]

    for page in pages:
        template = env.get_template(page["template"])
        context = {**common, **page["extra"]}
        context["request"] = None  # Not needed for static

        html = template.render(**context)

        # For static: replace href="/" links with relative paths
        html = html.replace('href="/"', 'href="index.html"')
        html = html.replace('href="/predictions"', 'href="predictions.html"')
        html = html.replace('href="/players"', 'href="players.html"')
        html = html.replace('href="/simulator"', 'href="simulator.html"')
        html = html.replace('href="/static/', 'href="static/')
        html = html.replace('src="/static/', 'src="static/')
        html = html.replace("href='/static/", "href='static/")
        html = html.replace("src='/static/", "src='static/")

        output_path = os.path.join(OUTPUT_DIR, page["output"])
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  ✓ {page['output']}")

    print(f"\n✅ Static site built in {OUTPUT_DIR}/")
    print(f"   Open {OUTPUT_DIR}/index.html to preview")


if __name__ == "__main__":
    build()
