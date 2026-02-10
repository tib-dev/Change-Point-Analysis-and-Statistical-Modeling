from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from pathlib import Path
from point_analysis.core.project_root import get_project_root

# -----------------------------------------------------------------------------
# App setup
# -----------------------------------------------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# -----------------------------------------------------------------------------
# Paths
# -----------------------------------------------------------------------------
ROOT = get_project_root()

PRICES_PATH = ROOT / "data" / "processed" / "prices.csv"
CHANGEPOINTS_PATH = ROOT / "models" / "changepoints.csv"
EVENTS_PATH = ROOT / "data"/"event" / "events.csv"

# -----------------------------------------------------------------------------
# Data loading utilities
# -----------------------------------------------------------------------------
def safe_read_csv(path: Path, parse_dates=None) -> pd.DataFrame:
    try:
        return pd.read_csv(path, parse_dates=parse_dates)
    except FileNotFoundError:
        app.logger.error(f"Missing file: {path}")
    except Exception as e:
        app.logger.error(f"Failed to read {path}: {e}")
    return pd.DataFrame()


def load_prices() -> pd.DataFrame:
    return safe_read_csv(PRICES_PATH, parse_dates=["date"])


def load_changepoints() -> pd.DataFrame:
    return safe_read_csv(CHANGEPOINTS_PATH, parse_dates=["date"])


def load_events() -> pd.DataFrame:
    return safe_read_csv(EVENTS_PATH, parse_dates=["date"])


def clean_for_json(df: pd.DataFrame) -> pd.DataFrame:
    df = df.replace([np.inf, -np.inf], np.nan)
    return df.where(pd.notnull(df), None)

# -----------------------------------------------------------------------------
# Health check
# -----------------------------------------------------------------------------
@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200

# -----------------------------------------------------------------------------
# API endpoints
# -----------------------------------------------------------------------------
@app.route("/api/prices")
def get_prices():
    df = load_prices()
    if df.empty:
        return jsonify({"message": "No price data available"}), 404

    start = request.args.get("start")
    end = request.args.get("end")

    if start:
        df = df[df["date"] >= pd.to_datetime(start)]
    if end:
        df = df[df["date"] <= pd.to_datetime(end)]

    df = df.assign(date=df["date"].dt.strftime("%Y-%m-%d"))
    df = clean_for_json(df)

    return jsonify(df.to_dict(orient="records"))


@app.route("/api/changepoints")
def get_changepoints():
    df = load_changepoints()
    if df.empty:
        return jsonify({"message": "No changepoints found"}), 404

    df = df.assign(date=df["date"].dt.strftime("%Y-%m-%d"))
    df = clean_for_json(df)

    return jsonify(df.to_dict(orient="records"))


@app.route("/api/events")
def get_events():
    df = load_events()
    if df.empty:
        return jsonify({"message": "No events found"}), 404

    df = df.assign(date=df["date"].dt.strftime("%Y-%m-%d"))
    df = clean_for_json(df)

    return jsonify(df.to_dict(orient="records"))


@app.route("/api/correlation")
def get_correlation():
    df = load_prices()
    if df.empty:
        return jsonify({"message": "No data available"}), 404

    numeric_df = df.select_dtypes(include=[np.number])
    if numeric_df.shape[1] < 2:
        return jsonify({"message": "Not enough numerical columns"}), 200

    corr = numeric_df.corr().round(4)
    corr = clean_for_json(corr)

    return jsonify(corr.to_dict())


@app.route("/api/impact-summary")
def get_impact_summary():
    df = load_changepoints()
    if df.empty:
        return jsonify({"message": "No changepoints found"}), 404

    required_cols = {
        "date",
        "associated_event",
        "mu_pre_change",
        "mu_post_change",
        "sigma_pre_change",
        "sigma_post_change",
    }

    if not required_cols.issubset(df.columns):
        return jsonify({"error": "Invalid changepoints schema"}), 500

    latest = df.sort_values("date").iloc[-1]

    summary = {
        "event": latest["associated_event"],
        "date": latest["date"].strftime("%Y-%m-%d"),
        "price_shift": round(
            latest["mu_post_change"] - latest["mu_pre_change"], 4
        ),
        "volatility_change": round(
            latest["sigma_post_change"] - latest["sigma_pre_change"], 4
        ),
    }

    return jsonify(summary)

# -----------------------------------------------------------------------------
# Entry point
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
