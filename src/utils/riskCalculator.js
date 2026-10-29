
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

  // Validate inputs
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

  if (!["long", "short"].includes(tradeType)) {
    throw new Error("Please select Long or Short.");
  }

  // Validate stop-loss direction
  if (tradeType === "long" && stopLossPrice >= entryPrice) {
    throw new Error(
      "For a Long trade, Stop Loss must be below Entry Price."
    );
  }

  if (tradeType === "short" && stopLossPrice <= entryPrice) {
    throw new Error(
      "For a Short trade, Stop Loss must be above Entry Price."
    );
  }

  // Calculate allowed risk
  const riskAmount = capital * (riskPercent / 100);

  // Calculate risk per share
  const slPoints = Math.abs(entryPrice - stopLossPrice);

  // Quantity allowed by risk limit
  const riskBasedQuantity = Math.floor(
    riskAmount / slPoints
  );

  // Quantity allowed by available capital (no leverage)
  const capitalBasedQuantity = Math.floor(
    capital / entryPrice
  );

  // Respect BOTH limits
  const quantity = Math.min(
    riskBasedQuantity,
    capitalBasedQuantity
  );

  if (quantity < 1) {
    throw new Error(
      "Insufficient capital or risk budget for even 1 share."
    );
  }

  // Calculate target
  const targetPoints = slPoints * riskReward;

  const targetPrice =
    tradeType === "long"
      ? entryPrice + targetPoints
      : entryPrice - targetPoints;

  // Calculate actual risk and potential profit
  const actualRisk = quantity * slPoints;
  const potentialProfit = quantity * targetPoints;
  const positionValue = quantity * entryPrice;

  return {
    riskAmount,
    slPoints,
    quantity,
    targetPoints,
    targetPrice,
    actualRisk,
    potentialProfit,
    positionValue,
    capitalBasedQuantity,
    riskBasedQuantity,
  };
}
