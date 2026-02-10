## Backend (Flask API)

1. Create and activate a virtual environment
2. Install dependencies:
   pip install -r requirements.txt
3. Run the server:
   python app.py

The API runs at http://localhost:5000

## Frontend (React Dashboard)

1. Install dependencies:
   npm install
2. Start development server:
   npm start

The dashboard runs at http://localhost:3000

## API Endpoints

### GET /api/prices

Returns historical price data.

Query parameters:

- start (YYYY-MM-DD, optional)
- end (YYYY-MM-DD, optional)

Response:
[
{ "date": "2022-03-01", "price": 95.2 }
]

---

### GET /api/events

Returns external events.

Query parameters:

- start (YYYY-MM-DD, optional)
- end (YYYY-MM-DD, optional)
- category (string, optional)

---

### GET /api/changepoints

Returns detected Bayesian regime shifts and impact metrics.

---

### GET /api/impact-summary

Returns a human-readable summary of the most recent regime shift.

## API Endpoints

### GET /api/prices

Returns historical price data.

Query parameters:

- start (YYYY-MM-DD, optional)
- end (YYYY-MM-DD, optional)

Response:
[
{ "date": "2022-03-01", "price": 95.2 }
]

---

### GET /api/events

Returns external events.

Query parameters:

- start (YYYY-MM-DD, optional)
- end (YYYY-MM-DD, optional)
- category (string, optional)

---

### GET /api/changepoints

Returns detected Bayesian regime shifts and impact metrics.

---

### GET /api/impact-summary

Returns a human-readable summary of the most recent regime shift.

“The dashboard allows users to filter prices and events by date and category, while visually aligning Bayesian-detected change points with external events to support exploratory causal analysis.”
