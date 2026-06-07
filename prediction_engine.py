"""
2026 NBA Finals Prediction Engine
Combines Elo ratings, team statistics, player data, series context, and Monte Carlo simulation.
"""

import math
import random
from dataclasses import dataclass, field
from team_data import TEAMS, SERIES, FINALS_GAMES, HISTORICAL, PLAYERS, PLAYER_IMPACT_WEIGHTS


@dataclass
class GamePrediction:
    game_number: int
    home_team: str
    away_team: str
    home_win_prob: float
    away_win_prob: float
    predicted_home_score: int
    predicted_away_score: int
    key_factors: list = field(default_factory=list)
    player_insights: list = field(default_factory=list)
    location: str = ""
    date: str = ""


@dataclass
class SeriesPrediction:
    spurs_win_prob: float
    knicks_win_prob: float
    most_likely_outcome: str
    outcome_probabilities: dict = field(default_factory=dict)
    average_games: float = 0.0


# --- Elo System ---

BASE_ELO = 1500
HOME_ADVANTAGE_ELO = 100
PLAYOFF_BONUS = 50
K_FACTOR = 32


def expected_score(elo_a: float, elo_b: float) -> float:
    return 1.0 / (1.0 + math.pow(10, (elo_b - elo_a) / 400.0))


def elo_diff_to_win_prob(elo_diff: float) -> float:
    return 1.0 / (1.0 + math.pow(10, -elo_diff / 400.0))


# --- Team Strength ---

def compute_team_strength(team_key: str) -> float:
    team = TEAMS[team_key]
    stats = team["stats"]
    off_component = (stats["off_rtg"] - 110) * 0.35
    def_component = (115 - stats["def_rtg"]) * 0.30
    net_component = stats["net_rtg"] * 0.20
    ts_component = (stats["ts_pct"] - 0.55) * 100 * 0.10
    pace_component = (100 - abs(stats["pace"] - 99)) * 0.05
    return off_component + def_component + net_component + ts_component + pace_component


# --- Player Impact ---

def compute_player_impact(team_key: str, data_source: str = "finals") -> dict:
    """
    Compute player-level impact for a team.
    data_source: 'season', 'recent_10', 'playoffs', 'finals'
    Returns a dict with the team's weighted player impact score and insights.
    """
    players = PLAYERS[team_key]
    weights = PLAYER_IMPACT_WEIGHTS[team_key]
    insights = []

    total_impact = 0.0
    total_weight = 0.0

    for player in players:
        name = player["name"]
        weight = weights.get(name, 0.1)

        # Choose data source (fallback chain: finals -> playoffs -> recent_10 -> season)
        if data_source == "finals" and "finals" in player:
            stats = player["finals"]
            src_label = "Finals"
        elif "playoffs" in player:
            stats = player["playoffs"]
            src_label = "Playoffs"
        elif "recent_10" in player:
            stats = player["recent_10"]
            src_label = "Last 10"
        else:
            stats = {
                "ppg": player["ppg"], "rpg": player["rpg"], "apg": player["apg"],
                "bpg": player["bpg"], "spg": player["spg"],
                "fg_pct": player["fg_pct"], "three_pct": player["three_pct"],
            }
            src_label = "Season"

        # Calculate individual player efficiency score
        # Normalize each stat to a 0-100 scale relative to position expectations
        scoring = (stats["ppg"] / 30.0) * 100       # 30 PPG = 100
        rebounding = (stats["rpg"] / 12.0) * 100     # 12 RPG = 100
        playmaking = (stats["apg"] / 8.0) * 100      # 8 APG = 100
        defense = ((stats.get("bpg", 0) + stats.get("spg", 0)) / 4.0) * 100  # combined
        efficiency = (stats.get("fg_pct", 0.45) / 0.55) * 100  # 55% FG = 100

        player_score = (
            scoring * 0.30
            + rebounding * 0.20
            + playmaking * 0.20
            + defense * 0.15
            + efficiency * 0.15
        )

        # Clamp to reasonable range
        player_score = max(20, min(100, player_score))

        total_impact += player_score * weight
        total_weight += weight

        # Generate insights
        trend = player.get("trend", "stable")
        status = player.get("status", "healthy")

        # Compare Finals to season averages
        ppg_diff = stats["ppg"] - player["ppg"]
        trend_emoji = "📈" if ppg_diff > 1.5 else ("📉" if ppg_diff < -1.5 else "➡️")

        insight = {
            "name": name,
            "position": player["position"],
            "team": team_key,
            "data_source": src_label,
            "stats": stats,
            "season_stats": {"ppg": player["ppg"], "rpg": player["rpg"], "apg": player["apg"],
                            "bpg": player["bpg"], "spg": player["spg"],
                            "fg_pct": player["fg_pct"], "three_pct": player["three_pct"]},
            "ppg_diff": round(ppg_diff, 1),
            "trend": trend,
            "trend_emoji": trend_emoji,
            "status": status,
            "player_score": round(player_score, 1),
            "weight": weight,
            "advanced": player.get("advanced", {}),
        }
        insights.append(insight)

    # Normalize
    team_impact = total_impact / total_weight if total_weight > 0 else 50.0

    return {
        "team_impact": round(team_impact, 2),
        "insights": insights,
    }


def compute_player_elo_adjustment() -> float:
    """
    Compute Elo adjustment based on player performance data.
    Positive = Knicks advantage, Negative = Spurs advantage.
    """
    spurs_impact = compute_player_impact("spurs", "finals")
    knicks_impact = compute_player_impact("knicks", "finals")

    # Scale impact difference to Elo points (roughly ±40 Elo max from player data)
    diff = knicks_impact["team_impact"] - spurs_impact["team_impact"]
    return diff * 0.8  # Scale factor


def get_player_insights_for_game(home_team: str, away_team: str) -> list:
    """Generate player-level insights for a game prediction."""
    insights = []

    home_impact = compute_player_impact(home_team, "finals")
    away_impact = compute_player_impact(away_team, "finals")

    # Top performer insight for each team
    for team_key, impact in [(home_team, home_impact), (away_team, away_impact)]:
        team_label = TEAMS[team_key]["abbr"]
        # Sort by player_score
        sorted_players = sorted(impact["insights"], key=lambda x: x["player_score"], reverse=True)
        top = sorted_players[0]
        insights.append(
            f"🌟 {team_label} MVP: {top['name']} - "
            f"{top['stats']['ppg']} PPG / {top['stats']['rpg']} RPG / {top['stats']['apg']} APG "
            f"({top['data_source']}) {top['trend_emoji']}"
        )

    # Hot/cold player insight
    for team_key, impact in [(home_team, home_impact), (away_team, away_impact)]:
        team_label = TEAMS[team_key]["abbr"]
        hot = [p for p in impact["insights"] if p["ppg_diff"] > 2.0]
        cold = [p for p in impact["insights"] if p["ppg_diff"] < -2.0]
        if hot:
            names = ", ".join(p["name"] for p in hot[:2])
            insights.append(f"🔥 {team_label} Hot: {names} (outperforming season avg)")
        if cold:
            names = ", ".join(p["name"] for p in cold[:2])
            insights.append(f"❄️ {team_label} Cold: {names} (below season avg)")

    return insights


# --- Series Context ---

def get_series_context(game_number: int) -> dict:
    spurs_wins = SERIES["spurs_wins"]
    knicks_wins = SERIES["knicks_wins"]
    total_games = spurs_wins + knicks_wins
    momentum = (knicks_wins - spurs_wins) / total_games if total_games > 0 else 0

    return {
        "momentum": momentum,
        "spurs_desperation": 1.0 if spurs_wins == 3 else 0.0,
        "knicks_desperation": 1.0 if knicks_wins == 3 else 0.0,
        "spurs_closeout": 1.0 if spurs_wins == 3 else 0.0,
        "knicks_closeout": 1.0 if knicks_wins == 3 else 0.0,
        "spurs_wins": spurs_wins,
        "knicks_wins": knicks_wins,
    }


# --- Core Prediction ---

def predict_game(game_number: int, spurs_wins: int = None, knicks_wins: int = None) -> GamePrediction:
    if spurs_wins is None:
        spurs_wins = SERIES["spurs_wins"]
    if knicks_wins is None:
        knicks_wins = SERIES["knicks_wins"]

    game_data = FINALS_GAMES[game_number - 1]
    home_team = game_data["home"]
    away_team = game_data["away"]

    # 1. Base Elo
    spurs_elo = TEAMS["spurs"]["elo"]
    knicks_elo = TEAMS["knicks"]["elo"]

    # 2. Home court advantage
    home_bonus = HOME_ADVANTAGE_ELO if home_team == "knicks" else -HOME_ADVANTAGE_ELO

    # 3. Team strength adjustment
    spurs_strength = compute_team_strength("spurs")
    knicks_strength = compute_team_strength("knicks")
    strength_diff = (knicks_strength - spurs_strength) * 15

    # 4. Player impact adjustment (NEW)
    player_elo = compute_player_elo_adjustment()

    # 5. Series context
    ctx = get_series_context(game_number)
    momentum_elo = ctx["momentum"] * 30

    desperation_elo = 0
    if ctx["spurs_desperation"]:
        desperation_elo = -25
    if ctx["knicks_desperation"]:
        desperation_elo = 25

    closeout_elo = 0
    if ctx["knicks_closeout"]:
        closeout_elo = -15
    if ctx["spurs_closeout"]:
        closeout_elo = 15

    # 6. Historical context
    historical_elo = -8

    # 7. Net Elo difference (from Knicks perspective)
    total_elo_diff = (
        (knicks_elo - spurs_elo)
        + home_bonus
        + strength_diff
        + player_elo       # NEW: player data factor
        + momentum_elo
        + desperation_elo
        + closeout_elo
        + historical_elo
    )

    # 8. Convert to win probability
    knicks_win_prob = elo_diff_to_win_prob(total_elo_diff)
    spurs_win_prob = 1 - knicks_win_prob

    # 9. Predicted scores (incorporate player scoring trends)
    spurs_impact = compute_player_impact("spurs", "finals")
    knicks_impact = compute_player_impact("knicks", "finals")

    spurs_stats = TEAMS["spurs"]["stats"]
    knicks_stats = TEAMS["knicks"]["stats"]

    base_spurs_score = (spurs_stats["ppg"] + knicks_stats["oppg"]) / 2
    base_knicks_score = (knicks_stats["ppg"] + spurs_stats["oppg"]) / 2

    # Player scoring adjustment
    spurs_scoring_adj = 0
    for p in spurs_impact["insights"]:
        spurs_scoring_adj += p["ppg_diff"] * p["weight"]

    knicks_scoring_adj = 0
    for p in knicks_impact["insights"]:
        knicks_scoring_adj += p["ppg_diff"] * p["weight"]

    # Game-specific variation (deterministic offsets per game)
    # Each game in a series has different dynamics
    game_offsets = {
        3: {"spurs": +3, "knicks": -1},   # G3: Spurs desperate, Knicks may relax
        4: {"spurs": +1, "knicks": +2},    # G4: Both teams settled in
        5: {"spurs": -1, "knicks": +3},    # G5: Knicks can clinch, high energy
        6: {"spurs": +4, "knicks": -2},    # G6: Spurs must-win, Knicks pressure
        7: {"spurs": +2, "knicks": +1},    # G7: Anything can happen
    }
    g_offset = game_offsets.get(game_number, {"spurs": 0, "knicks": 0})

    # Series state adjustments
    series_adj_spurs = 0
    series_adj_knicks = 0

    # If Spurs won previous game, momentum boost
    if game_number > 3 and spurs_wins > knicks_wins - (game_number - 3):
        series_adj_spurs += 2
        series_adj_knicks -= 1

    # Desperation/elimination adjustments
    if knicks_wins == 3:  # Knicks can clinch
        series_adj_knicks += 2
        series_adj_spurs += 3  # Spurs fight harder when facing elimination
    if spurs_wins == 3:
        series_adj_spurs += 2
        series_adj_knicks += 3

    # Home court
    if home_team == "spurs":
        predicted_spurs = int(base_spurs_score + 2.5 + spurs_scoring_adj + g_offset["spurs"] + series_adj_spurs)
        predicted_knicks = int(base_knicks_score - 1.5 + knicks_scoring_adj + g_offset["knicks"] + series_adj_knicks)
    else:
        predicted_spurs = int(base_spurs_score - 1.5 + spurs_scoring_adj + g_offset["spurs"] + series_adj_spurs)
        predicted_knicks = int(base_knicks_score + 2.5 + knicks_scoring_adj + g_offset["knicks"] + series_adj_knicks)

    # Ensure scores are realistic (85-130 range)
    predicted_spurs = max(85, min(130, predicted_spurs))
    predicted_knicks = max(85, min(130, predicted_knicks))

    # Avoid ties
    if predicted_spurs == predicted_knicks:
        if knicks_win_prob > 0.5:
            predicted_knicks += 1
        else:
            predicted_spurs += 1

    # 10. Key factors
    key_factors = []

    if home_team == "spurs":
        key_factors.append("🏠 Spurs home court at Frost Bank Center")
    else:
        key_factors.append("🏠 Knicks home court at Madison Square Garden")

    if ctx["spurs_wins"] == 0 and ctx["knicks_wins"] == 2:
        key_factors.append("⚠️ Spurs face 0-2 deficit (5.7% historical comeback rate)")
    elif ctx["spurs_wins"] == 0 and ctx["knicks_wins"] >= 2:
        key_factors.append("🔴 Spurs on the brink of elimination")

    if ctx["knicks_wins"] == 3:
        key_factors.append("🏆 Knicks can clinch the championship")

    key_factors.append(f"📊 Knicks net rating advantage: +{TEAMS['knicks']['stats']['net_rtg'] - TEAMS['spurs']['stats']['net_rtg']:.1f}")

    # Player-based insights
    if home_team == "spurs":
        key_factors.append(f"🎯 Wembanyama: {PLAYERS['spurs'][0]['ppg']} PPG, {PLAYERS['spurs'][0]['bpg']} BPG")
    else:
        key_factors.append(f"🎯 Brunson: {PLAYERS['knicks'][0]['ppg']} PPG, {PLAYERS['knicks'][0]['apg']} APG")

    # Player impact factor
    if abs(player_elo) > 5:
        if player_elo > 0:
            key_factors.append(f"⭐ Knicks player edge: +{player_elo:.0f} Elo ({knicks_impact['team_impact']:.1f} vs {spurs_impact['team_impact']:.1f})")
        else:
            key_factors.append(f"⭐ Spurs player edge: {player_elo:.0f} Elo ({spurs_impact['team_impact']:.1f} vs {knicks_impact['team_impact']:.1f})")

    # 11. Player insights
    player_insights = get_player_insights_for_game(home_team, away_team)

    return GamePrediction(
        game_number=game_number,
        home_team=home_team,
        away_team=away_team,
        home_win_prob=spurs_win_prob if home_team == "spurs" else knicks_win_prob,
        away_win_prob=knicks_win_prob if home_team == "spurs" else spurs_win_prob,
        predicted_home_score=predicted_spurs if home_team == "spurs" else predicted_knicks,
        predicted_away_score=predicted_knicks if home_team == "spurs" else predicted_spurs,
        key_factors=key_factors,
        player_insights=player_insights,
        location=game_data["location"],
        date=game_data["date"],
    )


# --- Monte Carlo Series Simulation ---

def simulate_series(n_simulations: int = 10000) -> SeriesPrediction:
    spurs_series_wins = 0
    knicks_series_wins = 0
    total_games_list = []
    outcome_counts = {}

    for _ in range(n_simulations):
        s_wins = SERIES["spurs_wins"]
        k_wins = SERIES["knicks_wins"]
        game_num = SERIES["games_played"] + 1

        while s_wins < 4 and k_wins < 4 and game_num <= 7:
            pred = predict_game(game_num, s_wins, k_wins)
            home_team = FINALS_GAMES[game_num - 1]["home"]
            home_win_prob = pred.home_win_prob

            if random.random() < home_win_prob:
                if home_team == "spurs":
                    s_wins += 1
                else:
                    k_wins += 1
            else:
                if home_team == "spurs":
                    k_wins += 1
                else:
                    s_wins += 1
            game_num += 1

        if s_wins == 4:
            spurs_series_wins += 1
        else:
            knicks_series_wins += 1

        total_games_list.append(s_wins + k_wins)
        outcome_key = f"{s_wins}-{k_wins}"
        outcome_counts[outcome_key] = outcome_counts.get(outcome_key, 0) + 1

    spurs_prob = spurs_series_wins / n_simulations
    knicks_prob = knicks_series_wins / n_simulations
    avg_games = sum(total_games_list) / len(total_games_list)
    most_likely = max(outcome_counts.items(), key=lambda x: x[1])
    outcome_probs = {k: v / n_simulations for k, v in sorted(outcome_counts.items())}

    return SeriesPrediction(
        spurs_win_prob=spurs_prob,
        knicks_win_prob=knicks_prob,
        most_likely_outcome=most_likely[0],
        outcome_probabilities=outcome_probs,
        average_games=avg_games,
    )


# --- Analysis Functions ---

def get_pregame_analysis() -> dict:
    spurs = TEAMS["spurs"]
    knicks = TEAMS["knicks"]
    s_stats = spurs["stats"]
    k_stats = knicks["stats"]

    comparisons = [
        {"label": "Points Per Game", "spurs": s_stats["ppg"], "knicks": k_stats["ppg"],
         "advantage": "knicks" if k_stats["ppg"] > s_stats["ppg"] else "spurs"},
        {"label": "Opponent PPG", "spurs": s_stats["oppg"], "knicks": k_stats["oppg"],
         "advantage": "spurs" if s_stats["oppg"] < k_stats["oppg"] else "knicks", "lower_better": True},
        {"label": "Offensive Rating", "spurs": s_stats["off_rtg"], "knicks": k_stats["off_rtg"],
         "advantage": "knicks" if k_stats["off_rtg"] > s_stats["off_rtg"] else "spurs"},
        {"label": "Defensive Rating", "spurs": s_stats["def_rtg"], "knicks": k_stats["def_rtg"],
         "advantage": "spurs" if s_stats["def_rtg"] < k_stats["def_rtg"] else "knicks", "lower_better": True},
        {"label": "Net Rating", "spurs": s_stats["net_rtg"], "knicks": k_stats["net_rtg"],
         "advantage": "knicks" if k_stats["net_rtg"] > s_stats["net_rtg"] else "spurs"},
        {"label": "FG%", "spurs": round(s_stats["fg_pct"] * 100, 1), "knicks": round(k_stats["fg_pct"] * 100, 1),
         "advantage": "knicks" if k_stats["fg_pct"] > s_stats["fg_pct"] else "spurs"},
        {"label": "3PT%", "spurs": round(s_stats["three_pct"] * 100, 1), "knicks": round(k_stats["three_pct"] * 100, 1),
         "advantage": "knicks" if k_stats["three_pct"] > s_stats["three_pct"] else "spurs"},
        {"label": "Rebounds Per Game", "spurs": s_stats["rpg"], "knicks": k_stats["rpg"],
         "advantage": "knicks" if k_stats["rpg"] > s_stats["rpg"] else "spurs"},
        {"label": "Assists Per Game", "spurs": s_stats["apg"], "knicks": k_stats["apg"],
         "advantage": "knicks" if k_stats["apg"] > s_stats["apg"] else "spurs"},
        {"label": "Blocks Per Game", "spurs": s_stats["bpg"], "knicks": k_stats["bpg"],
         "advantage": "spurs" if s_stats["bpg"] > k_stats["bpg"] else "knicks"},
    ]

    spurs_adv = sum(1 for c in comparisons if c["advantage"] == "spurs")
    knicks_adv = sum(1 for c in comparisons if c["advantage"] == "knicks")

    # Player impact comparison
    spurs_impact = compute_player_impact("spurs", "finals")
    knicks_impact = compute_player_impact("knicks", "finals")

    return {
        "comparisons": comparisons,
        "spurs_advantages": spurs_adv,
        "knicks_advantages": knicks_adv,
        "summary": f"Knicks lead in {knicks_adv} of {len(comparisons)} categories, Spurs lead in {spurs_adv}.",
        "spurs_player_impact": spurs_impact,
        "knicks_player_impact": knicks_impact,
    }


def get_player_matchups() -> list:
    matchups = [
        {
            "position": "PG",
            "spurs_player": PLAYERS["spurs"][1],
            "knicks_player": PLAYERS["knicks"][0],
            "edge": "knicks",
            "analysis": "Brunson has been the best player in the Finals so far. "
                       "Fox needs to match his scoring to keep the Spurs in it.",
        },
        {
            "position": "C",
            "spurs_player": PLAYERS["spurs"][0],
            "knicks_player": PLAYERS["knicks"][1],
            "edge": "spurs",
            "analysis": "Wembanyama's defensive impact (3.8 BPG) is unmatched. "
                       "Towns provides spacing but can't match Victor's rim protection.",
        },
        {
            "position": "SF",
            "spurs_player": PLAYERS["spurs"][3],
            "knicks_player": PLAYERS["knicks"][2],
            "edge": "knicks",
            "analysis": "Anunoby's lockdown defense on Wembanyama has been critical. "
                       "Johnson needs to provide more secondary scoring.",
        },
        {
            "position": "SG",
            "spurs_player": PLAYERS["spurs"][2],
            "knicks_player": PLAYERS["knicks"][3],
            "edge": "even",
            "analysis": "Both are athletic two-way guards. Castle has shown flashes "
                       "but Bridges' experience is showing in the Finals.",
        },
        {
            "position": "PF",
            "spurs_player": PLAYERS["spurs"][4],
            "knicks_player": PLAYERS["knicks"][4],
            "edge": "knicks",
            "analysis": "Hart's rebounding and hustle plays have been a difference-maker. "
                       "Sochan needs to be more aggressive on offense.",
        },
    ]
    return matchups
