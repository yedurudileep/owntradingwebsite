export function calculateRisk({
  capital,
  riskPercent,
  entryPrice,
  stopLossPrice,
  riskReward,
  tradeType,
}) {
  // Convert inputs to numbers
  capital = Number(capital);
  riskPercent = Number(riskPercent);
  entryPrice = Number(entryPrice);
  stopLossPrice = Number(stopLossPrice);
  riskReward = Number(riskReward);

  // Basic validation
  if (
    !Number.isFinite(capital) ||
    !Number.isFinite(riskPercent) ||
    !Number.isFinite(entryPrice) ||
    !Number.isFinite(stopLossPrice) ||
    !Number.isFinite(riskReward)
  ) {
    throw new Error("Please enter valid numbers in all fields.");
  }

  if (
    capital <= 0 ||
    riskPercent <= 0 ||
    entryPrice <= 0 ||
    stopLossPrice <= 0 ||
    riskReward <= 0
  ) {
    throw new Error("All values must be greater than 0.");
  }

  // ----------------------------------------
  // LONG VALIDATION
  // ----------------------------------------

  if (tradeType === "long" && stopLossPrice >= entryPrice) {
    throw new Error(
      "Invalid Stop Loss: For a Long trade, Stop Loss must be below Entry Price."
    );
  }

  // ----------------------------------------
  // SHORT VALIDATION
  // ----------------------------------------

  if (tradeType === "short" && stopLossPrice <= entryPrice) {
    throw new Error(
      "Invalid Stop Loss: For a Short trade, Stop Loss must be above Entry Price."
    );
  }

  // ----------------------------------------
  // RISK AMOUNT
  // ----------------------------------------

  const riskAmount = capital * (riskPercent / 100);

  // ----------------------------------------
  // SL DISTANCE
  // ----------------------------------------

  const slPoints = Math.abs(entryPrice - stopLossPrice);

  if (slPoints === 0) {
    throw new Error(
      "Entry Price and Stop Loss cannot be the same."
    );
  }

  // ----------------------------------------
  // POSITION SIZE
  // ----------------------------------------

  const quantity = Math.floor(riskAmount / slPoints);

  if (quantity < 1) {
    throw new Error(
      "Risk amount is too small for the selected Stop Loss."
    );
  }

  // ----------------------------------------
  // TARGET DISTANCE
  // ----------------------------------------

  const targetPoints = slPoints * riskReward;

  // ----------------------------------------
  // TARGET PRICE
  // ----------------------------------------

  let targetPrice;

  if (tradeType === "long") {
    targetPrice = entryPrice + targetPoints;
  } else {
    targetPrice = entryPrice - targetPoints;
  }

  // ----------------------------------------
  // ACTUAL RISK
  // ----------------------------------------

  const actualRisk = quantity * slPoints;

  // ----------------------------------------
  // POTENTIAL PROFIT
  // ----------------------------------------

  const potentialProfit = quantity * targetPoints;

  return {
    riskAmount,
    slPoints,
    quantity,
    targetPoints,
    targetPrice,
    actualRisk,
    potentialProfit,
  };
}