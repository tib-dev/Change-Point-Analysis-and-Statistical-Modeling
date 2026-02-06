# Brent Crude Oil Analysis: Structural Breaks & Event Attribution

## 1. Overview of the Analysis

Brent crude oil prices are highly sensitive to geopolitical events, policy decisions, and macroeconomic shocks. This analysis aims to identify **structural breaks** (change points) in historical Brent oil prices and associate them with major political, economic, and energy-sector events.

Using **Bayesian change point models**, the study quantifies how these events shift price dynamics over time and translates these findings into actionable insights for:

- **Investors:** For risk assessment and portfolio rebalancing.
- **Policymakers:** To understand the efficacy of energy regulations.
- **Energy Companies:** To optimize supply chain and pricing strategies.

---

## 2. Data Analysis Workflow

The analysis follows a structured, end-to-end workflow to ensure transparency, reproducibility, and interpretability.

### Step 1: Data Ingestion and Cleaning

- Load daily Brent oil price data (1987–2022).
- Convert date fields to proper datetime format.
- Sort data chronologically and handle missing or anomalous values.

### Step 2: Exploratory Data Analysis (EDA)

- Plot raw price series to identify long-term trends, shocks, and regime changes.
- Compute and visualize log returns to stabilize variance.
- Examine volatility clustering and extreme price movements.
- Conduct stationarity tests, such as the **Augmented Dickey-Fuller (ADF)** test, on prices and returns.

### Step 3: Event Data Compilation

- Research major geopolitical, economic, and OPEC-related events affecting oil markets.
- Construct a structured event dataset with dates and descriptions.
- Align event timelines with price data for comparison.

### Step 4: Statistical Modeling

- Specify Bayesian change point models using **PyMC**.
- Define priors for change point locations and regime parameters.
- Run **Markov Chain Monte Carlo (MCMC)** sampling to infer posterior distributions.

### Step 5: Interpretation and Attribution

- Identify statistically significant change points from the model output.
- Compare detected breakpoints with known historical events.
- Quantify shifts in average price levels or volatility.
- Formulate hypotheses linking specific events to observed structural changes.

### Step 6: Communication and Visualization

- Produce clear plots of change points and posterior distributions.
- Translate statistical outputs into business-relevant insights.
- Prepare results for dashboards, reports, and policy briefs.

## 3. Event Data Compilation

- 15 key event data have collected and saved as key_events.csv

## 4. Assumptions and Limitations

### Key Assumptions

- **Timely Response:** Oil prices respond to major events with limited delay.
- **Regime Significance:** Structural breaks in the time series reflect fundamental regime changes rather than random noise.
- **Stationarity:** Log returns approximate stationarity sufficiently for modeling purposes.
- **Persistence:** Events are assumed to have a persistent impact rather than purely transitory effects.

### Limitations

- **Correlation vs. Causation:** Change point detection identifies temporal alignment, not causal proof. A detected change near an event does not guarantee causality.
- **Confounding Variables:** Overlapping events may confound attribution; it is difficult to isolate a single driver when multiple events occur simultaneously.
- **Model Simplification:** The model focuses on price levels or returns, potentially oversimplifying complex market dynamics.
- **Excluded Variables:** External macroeconomic variables (GDP, FX rates, inventories) are excluded from the base model.

---

## 5. Communication Channels

Different stakeholders require tailored formats to ensure the data is actionable:

| Stakeholder          | Channel               | Format                                       |
| :------------------- | :-------------------- | :------------------------------------------- |
| **Investors**        | Interactive Dashboard | Web app with filters and real-time updates   |
| **Policymakers**     | Policy Brief          | PDF / Executive summary focusing on impact   |
| **Energy Companies** | Technical Report      | Detailed analytics and forecasting           |
| **Analysts**         | Jupyter Notebook      | Reproducible code and raw statistical output |

---

## 6. Understanding the Data and Time Series Properties

### Trend Analysis

- Long-term upward drift punctuated by sharp collapses and spikes.
- Characterized by structural regime shifts rather than smooth, linear evolution.

### Stationarity

- Raw prices are **non-stationary**, showing trends that change over time.
- Log returns are **approximately stationary**, making them suitable for statistical modeling.

### Volatility Patterns

- Strong **volatility clustering** (periods of high swings followed by relative calm).
- Extreme variance observed during global crises (e.g., 2008 Financial Crisis, 2020 Pandemic, 2022 Geopolitical conflicts).

> **Strategy:** These properties motivate modeling **returns** instead of raw prices and allowing for regime changes via change point models.

---

## 7. Change Point Models Explained

Change point models detect structural breaks where the statistical properties of a time series change. In this context, they identify periods where:

1. Average oil price shifts significantly.
2. Market behavior changes due to external shocks.

**Bayesian change point models specifically provide:**

- **Probabilistic estimates** of break dates (when the change likely occurred).
- **Uncertainty intervals** for those dates.
- **Robust inference** even in the presence of market noise.

---

## 8. Expected Outputs and Limitations

### Expected Outputs

- **Posterior distribution** of change point dates.
- **Estimated mean price** (or return) before and after each detected change.
- **Credible intervals** for parameter shifts to quantify confidence.

### Model Limitations

- **Sensitivity:** Results can be sensitive to model assumptions and the choice of "priors."
- **False Positives:** The model may detect statistical changes that do not correspond to any real-world event.
- **Complexity:** Single change point models may miss the complexity of multi-regime shifts over several decades.
