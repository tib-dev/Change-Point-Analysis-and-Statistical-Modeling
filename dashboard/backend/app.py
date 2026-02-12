from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
import pandas as pd
import numpy as np
from pathlib import Path
from point_analysis.core.project_root import get_project_root

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}},
    expose_headers=["Content-Range"],
)

ROOT = get_project_root()

PRICES_PATH = ROOT / "data" / "processed" / "prices.csv"
CHANGEPOINTS_PATH = ROOT / "models" / "changepoints.csv"
EVENTS_PATH = ROOT / "data" / "event" / "events.csv"


# =============================================================================
# Utilities
# =============================================================================

def safe_read_csv(path: Path, parse_dates=None) -> pd.DataFrame:
    if not path.exists():
        app.logger.error(f"File not found: {path}")
        return pd.DataFrame()

    try:
        return pd.read_csv(path, parse_dates=parse_dates)
    except Exception as e:
        app.logger.error(f"Error reading {path}: {e}")
        return pd.DataFrame()


def clean_for_json(df: pd.DataFrame) -> pd.DataFrame:
    df = df.replace([np.inf, -np.inf], np.nan)
    return df.where(pd.notnull(df), None)


def parse_int(value, default):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def apply_date_filter(df: pd.DataFrame) -> pd.DataFrame:
    if "date" not in df.columns:
        return df

    start = request.args.get("start")
    end = request.args.get("end")

    if start:
        df = df[df["date"] >= pd.to_datetime(start, errors="coerce")]
    if end:
        df = df[df["date"] <= pd.to_datetime(end, errors="coerce")]

    return df


def apply_sorting(df: pd.DataFrame) -> pd.DataFrame:
    sort_by = request.args.get("sortBy")
    order = request.args.get("order", "asc")

    if sort_by and sort_by in df.columns:
        df = df.sort_values(sort_by, ascending=(order == "asc"))

    return df


def apply_pagination(df: pd.DataFrame, resource_name: str):
    page = parse_int(request.args.get("page"), 1)
    per_page = parse_int(request.args.get("perPage"), 50)

    if per_page <= 0:
        per_page = 50

    start = (page - 1) * per_page
    end = start + per_page

    total = len(df)

    if start >= total:
        return jsonify({"error": "Page out of range"}), 416

    paginated = df.iloc[start:end]

    response = make_response(jsonify(paginated.to_dict(orient="records")))
    response.headers["Content-Range"] = (
        f"{resource_name} {start}-{min(end-1, total-1)}/{total}"
    )
    response.headers["Access-Control-Expose-Headers"] = "Content-Range"

    return response


def format_dates(df: pd.DataFrame) -> pd.DataFrame:
    if "date" in df.columns:
        df["date"] = df["date"].dt.strftime("%Y-%m-%d")
    return df


def add_log_returns(df: pd.DataFrame) -> pd.DataFrame:
    if "price" not in df.columns:
        return df

    df = df.sort_values("date")
    df["returns"] = np.log(df["price"]).diff()
    return df


# =============================================================================
# Health
# =============================================================================

@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200


# =============================================================================
# Prices
# =============================================================================

@app.route("/api/prices")
def get_prices():
    df = safe_read_csv(PRICES_PATH, parse_dates=["date"])
    if df.empty:
        return jsonify({"error": "No price data available"}), 404

    mode = request.args.get("mode", "price")

    df = apply_date_filter(df)
    df = apply_sorting(df)

    if mode == "returns":
        df = add_log_returns(df)

    df = clean_for_json(df)
    df = format_dates(df)

    return apply_pagination(df, "prices")


# =============================================================================
# Change Points
# =============================================================================

@app.route("/api/changepoints")
def get_changepoints():
    # 1. Load the data
    df = safe_read_csv(CHANGEPOINTS_PATH, parse_dates=["date"])

    # Early exit if file is missing/totally empty
    if df is None or df.empty:
        return jsonify({
            "changepoints": [],
            "total": 0,
            "message": "Source file empty or missing"
        }), 200

    # 2. Apply Filters
    df = apply_date_filter(df)

    # 3. CRITICAL CHECK: Handle the "No Data in this Range" scenario
    # Instead of letting pagination fail with a 416, we return a 200 with empty list
    if df.empty:
        return jsonify({
            "changepoints": [],
            "total": 0,
            "page": request.args.get('page', 1, type=int),
            "limit": request.args.get('limit', 10, type=int)
        }), 200

    # 4. Standard Processing
    df = apply_sorting(df)
    df = clean_for_json(df)
    df = format_dates(df)

    # 5. Paginate only when we know we have rows
    return apply_pagination(df, "changepoints")
# =============================================================================
# Events
# =============================================================================

@app.route("/api/events")
def get_events():
    df = safe_read_csv(EVENTS_PATH, parse_dates=["date"])
    if df.empty:
        return jsonify({"error": "No events found"}), 404

    df = apply_date_filter(df)

    category = request.args.get("category")
    if category and "category" in df.columns:
        df = df[df["category"] == category]

    df = apply_sorting(df)
    df = clean_for_json(df)
    df = format_dates(df)

    return apply_pagination(df, "events")


# =============================================================================
# Event Impact (Statistically Correct Version)
# =============================================================================

@app.route("/api/event-impact")
def get_event_impact():
    event_name = request.args.get("event")
    window = parse_int(request.args.get("window"), 30)

    if not event_name:
        return jsonify({"error": "event parameter is required"}), 400

    prices = safe_read_csv(PRICES_PATH, parse_dates=["date"])
    events = safe_read_csv(EVENTS_PATH, parse_dates=["date"])

    if prices.empty or events.empty:
        return jsonify({"error": "Required data not available"}), 404

    prices = add_log_returns(prices)

    event_row = events[events["event_name"] == event_name]
    if event_row.empty:
        return jsonify({"error": "Event not found"}), 404

    event_date = event_row.iloc[0]["date"]

    before = prices[
        (prices["date"] < event_date) &
        (prices["date"] >= event_date - pd.Timedelta(days=window))
    ]

    after = prices[
        (prices["date"] > event_date) &
        (prices["date"] <= event_date + pd.Timedelta(days=window))
    ]

    if before.empty or after.empty:
        return jsonify({"error": "Not enough data around event"}), 400

    mean_before = before["returns"].mean()
    mean_after = after["returns"].mean()

    vol_before = before["returns"].std()
    vol_after = after["returns"].std()

    return jsonify({
        "event": event_name,
        "event_date": event_date.strftime("%Y-%m-%d"),
        "window_days": window,
        "returns": {
            "mean_before": round(mean_before, 6),
            "mean_after": round(mean_after, 6),
            "shift": round(mean_after - mean_before, 6),
        },
        "volatility": {
            "before": round(vol_before, 6),
            "after": round(vol_after, 6),
            "shift": round(vol_after - vol_before, 6),
        }
    })


# =============================================================================
# Impact Summary
# =============================================================================

@app.route("/api/impact-summary")
def get_impact_summary():
    df = safe_read_csv(CHANGEPOINTS_PATH, parse_dates=["date"])
    if df.empty:
        return jsonify({
            "event": None,
            "price_shift": 0,
            "volatility_change": 0,
            "date": None,
            "count": 0
        })

    df = apply_date_filter(df)

    if df.empty:
        return jsonify({
            "event": None,
            "price_shift": 0,
            "volatility_change": 0,
            "date": None,
            "count": 0
        })

    latest = df.sort_values("date").iloc[-1]

    return jsonify({
        "event": latest.get("associated_event"),
        "date": latest["date"].strftime("%Y-%m-%d"),
        "price_shift": round(
            latest.get("mu_post_change", 0) - latest.get("mu_pre_change", 0), 6
        ),
        "volatility_change": round(
            latest.get("sigma_post_change", 0) - latest.get("sigma_pre_change", 0), 6
        ),
        "count": len(df)
    })


# =============================================================================
# Entry
# =============================================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
