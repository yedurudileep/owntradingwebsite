import { useState } from "react";
import { calculateRisk } from "../utils/riskCalculator";

function RiskCalculator() {
  const [tradeType, setTradeType] = useState("long");

  const [formData, setFormData] = useState({
    capital: 10000,
    riskPercent: 1,
    entryPrice: "",
    stopLossPrice: "",
    riskReward: 2,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setResult(null);
    setError("");
  }

  function handleTradeType(type) {
    setTradeType(type);
    setResult(null);
    setError("");
  }

  function handleCalculate() {
    try {
      setError("");

      const calculation = calculateRisk({
        ...formData,
        tradeType,
      });

      setResult(calculation);
    } catch (error) {
      setResult(null);
      setError(error.message);
    }
  }

  return (
    <div className="calculator-page">
      <div className="calculator-header">
        <div>
          <div className="eyebrow">TRADE PLANNER</div>

          <h1>Risk Management</h1>

          <p>
            Calculate position size, stop loss and target before entering a
            trade.
          </p>
        </div>

        <div className="rr-badge">
          <span>R:R</span>
          <strong>1 : {formData.riskReward || 0}</strong>
        </div>
      </div>

      <div className="calculator-grid">
        {/* LEFT SIDE */}
        <section className="calculator-card input-card">
          <div className="card-heading">
            <div>
              <h2>Trade Setup</h2>
              <p>Enter your trade parameters</p>
            </div>

            <div className="status-dot"></div>
          </div>

          {/* LONG / SHORT */}
          <div className="trade-toggle">
            <button
              type="button"
              className={tradeType === "long" ? "active long" : ""}
              onClick={() => handleTradeType("long")}
            >
              Long
            </button>

            <button
              type="button"
              className={tradeType === "short" ? "active short" : ""}
              onClick={() => handleTradeType("short")}
            >
              Short
            </button>
          </div>

          <div className="form-grid">
            {/* CAPITAL */}
            <div className="input-group">
              <label>Account Capital</label>

              <div className="input-wrapper">
                <span>₹</span>

                <input
                  type="number"
                  name="capital"
                  value={formData.capital}
                  onChange={handleChange}
                  min="1"
                  step="100"
                />
              </div>
            </div>

            {/* RISK */}
            <div className="input-group">
              <label>Risk Per Trade</label>

              <div className="input-wrapper">
                <input
                  type="number"
                  name="riskPercent"
                  value={formData.riskPercent}
                  onChange={handleChange}
                  min="0.01"
                  step="0.1"
                />

                <span>%</span>
              </div>
            </div>

            {/* ENTRY */}
            <div className="input-group">
              <label>Entry Price</label>

              <div className="input-wrapper">
                <span>₹</span>

                <input
                  type="number"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* SL */}
            <div className="input-group">
              <label>Stop Loss</label>

              <div className="input-wrapper">
                <span>₹</span>

                <input
                  type="number"
                  name="stopLossPrice"
                  value={formData.stopLossPrice}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* RR */}
            <div className="input-group full-width">
              <label>Risk : Reward</label>

              <div className="input-wrapper rr-input">
                <span>1 :</span>

                <input
                  type="number"
                  name="riskReward"
                  value={formData.riskReward}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                />
              </div>

              <small>
                Example: 2 means 1:2 risk-to-reward
              </small>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="button"
            className="calculate-button"
            onClick={handleCalculate}
          >
            Calculate Trade Plan
            <span>→</span>
          </button>
        </section>

        {/* RIGHT SIDE */}
        <section className="calculator-card result-card">
          <div className="card-heading">
            <div>
              <h2>Trade Plan</h2>
              <p>Your calculated position</p>
            </div>

            {result && (
              <span className="calculated-badge">CALCULATED</span>
            )}
          </div>

          {!result ? (
            <div className="empty-result">
              <div className="empty-icon">⌁</div>

              <h3>Waiting for setup</h3>

              <p>
                Enter your trade details and calculate your position size.
              </p>
            </div>
          ) : (
            <>
              <div className="main-result">
                <span>POSITION SIZE</span>

                <strong>{result.quantity}</strong>

                <small>SHARES</small>
              </div>

              <div className="result-grid">
                <div className="result-item">
                  <span>Risk Amount</span>
                  <strong>
                    ₹{result.riskAmount.toFixed(2)}
                  </strong>
                </div>

                <div className="result-item">
                  <span>Actual Risk</span>
                  <strong>
                    ₹{result.actualRisk.toFixed(2)}
                  </strong>
                </div>

                <div className="result-item">
                  <span>SL Distance</span>
                  <strong>
                    ₹{result.slPoints.toFixed(2)}
                  </strong>
                </div>

                <div className="result-item">
                  <span>Target Distance</span>
                  <strong>
                    ₹{result.targetPoints.toFixed(2)}
                  </strong>
                </div>
              </div>

              <div className="price-levels">
                <div className="price-row entry-row">
                  <div>
                    <span>ENTRY</span>
                    <strong>
                      ₹{Number(formData.entryPrice).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="price-row stop-row">
                  <div>
                    <span>STOP LOSS</span>
                    <strong>
                      ₹{Number(formData.stopLossPrice).toFixed(2)}
                    </strong>
                  </div>

                  <b>
                    -₹{result.actualRisk.toFixed(2)}
                  </b>
                </div>

                <div className="price-row target-row">
                  <div>
                    <span>TARGET</span>
                    <strong>
                      ₹{result.targetPrice.toFixed(2)}
                    </strong>
                  </div>

                  <b>
                    +₹{result.potentialProfit.toFixed(2)}
                  </b>
                </div>
              </div>

              <div className="reward-summary">
                <div>
                  <span>Risk</span>
                  <strong>
                    ₹{result.actualRisk.toFixed(2)}
                  </strong>
                </div>

                <div className="reward-divider">→</div>

                <div>
                  <span>Potential Reward</span>
                  <strong>
                    ₹{result.potentialProfit.toFixed(2)}
                  </strong>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default RiskCalculator;