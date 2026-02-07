# Change Point Analysis and Statistical Modeling of Time Series Data

**Detecting Structural Breaks and Associating Causes in Brent Oil Prices**

An end-to-end Bayesian time series analysis project focused on identifying structural breaks in Brent oil prices and linking them to major geopolitical and economic events.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Business Context](#business-context)
- [Objectives](#objectives)
- [Data & Features](#data--features)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Pipeline & Processing Steps](#pipeline--processing-steps)
- [Benchmark](#benchmark)
- [Engineering Practices](#engineering-practices)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Technologies Used](#technologies-used)
- [Author](#author)

---

## Project Overview

This project applies **Bayesian Change Point Analysis** to historical Brent crude oil prices to detect statistically significant regime shifts. These shifts are then interpreted in the context of major global events such as conflicts, OPEC policy decisions, sanctions, and economic crises.

The goal is not price prediction, but **understanding when and why price behavior fundamentally changes**.

---

## Business Context

Oil price volatility poses major challenges for:

- Investors managing exposure and risk
- Policymakers designing economic and energy strategies
- Energy companies planning production and supply chains

As a data scientist at **Birhan Energies**, the task is to deliver statistically sound, interpretable insights that connect price movements to real-world events using rigorous methods rather than intuition.

---

## Objectives

- Detect structural breaks in Brent oil price time series
- Quantify changes in price level, volatility, and returns
- Associate detected change points with historical events
- Provide interpretable, decision-support insights
- Communicate results through analysis, visuals, and dashboards

---

## Data & Features

### Core Dataset

- **Asset**: Brent crude oil
- **Frequency**: Daily
- **Period**: May 1987 – September 2022
- **Unit**: USD per barrel

### Columns

| Column | Description               |
| ------ | ------------------------- |
| Date   | Trading date              |
| Price  | Brent oil price (USD/bbl) |

### Engineered Features

- Log prices
- Log returns
- Rolling volatility
- Regime indicators
- Event alignment flags

---

## Learning Outcomes

### Technical Skills

- Bayesian change point detection
- Probabilistic modeling with PyMC
- MCMC diagnostics and posterior analysis
- Time series preprocessing and transformation

### Conceptual Understanding

- Structural breaks vs short-term volatility
- Bayesian inference and uncertainty quantification
- Linking statistical signals to real-world causation

---

## Project Structure

```text
change-point-analysis-and-statistical-modeling/
├── data/
│   ├── raw/
│   ├── interim/
│   └── processed/
├── events/
│   └── events.csv
├── notebooks/
│   ├── eda.ipynb
│   ├── change_point_model.ipynb
│   └── event_association.ipynb
├── dashboard/
│   ├── backend/        # Flask API
│   └── frontend/       # React UI
├── reports/
│   ├── figures/
│   └── final_report.pdf
├── src/
│   └── point_analysis/
│       ├── core/
│       ├── data/
│       ├── models/
│       ├── pipeline/
│       └── utils/
├── tests/
├── Makefile
├── pyproject.toml
├── requirements.lock
└── README.md
```

## Architecture

```text
┌─────────────────────┐
│ Brent Price Data    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Data Cleaning & EDA │
│ - Trends            │
│ - Stationarity      │
│ - Volatility        │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Bayesian Change     │
│ Point Model (PyMC)  │
│ - Regime means      │
│ - Regime variance   │
│ - Switch points     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Event Association   │
│ & Interpretation    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Reports & Dashboard │
└─────────────────────┘
```

## Pipeline & Processing Steps

- 1 Load raw Brent oil price data
- 2 Clean and standardize dates and prices
- 3 Conduct exploratory data analysis
- 4 Transform prices into log returns
- 5 Specify Bayesian change point models
- 6 Fit models using MCMC sampling
- 7 Validate convergence and posterior stability
- 8 Identify regime shifts and uncertainty intervals
- 9 Associate change points with known events
- 10 Present insights through reports and dashboard

## Pipeline & Processing Steps

- Load raw Brent oil price data
- Clean and standardize dates and prices
- Conduct exploratory data analysis
- Transform prices into log returns
- Specify Bayesian change point models
- Fit models using MCMC sampling
- Validate convergence and posterior stability
- Identify regime shifts and uncertainty intervals
- Associate change points with known events
- Present insights through reports and dashboard

## Setup & Installation

```bash
git clone https://github.com/<username>/change-point-analysis-and-statistical-modeling.git
cd change-point-analysis-and-statistical-modeling

python -m venv .venv
source .venv/bin/activate
```

- Local Development
- Installs dependencies and sets up the project in editable mode.

```bash
make install
```

- Production / Environment Sync
- Synchronizes the environment using locked dependency versions.

```bash
make sync
```

## Running the Project

- Exploratory Analysis

```bash
jupyter notebook notebooks/01_eda.ipynb
```

- Change Point Modeling

```bash
jupyter notebook notebooks/02_change_point_model.ipynb
```

- Dashboard Backend

```bash
cd dashboard/backend
python app.py
```

- Dashboard Frontend

```bash
cd dashboard/frontend
npm start
```

## Technologies Used

- Python 3.10+
- Pandas, NumPy
- PyMC, ArviZ
- Matplotlib / Seaborn
- Flask
- React

## Author

Tibebu Kaleb
Data Scientist
Bayesian Modeling • Time Series Analysis • Energy Market Analytics
