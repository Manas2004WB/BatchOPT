// Utility functions for ShotsPage and ShotRow

// Calculate delta E (Euclidean distance)
export function calcDeltaE(l, a, b, refL, refA, refB) {
  const deltaL = l;
  const deltaA = a;
  const deltaB = b;
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB).toFixed(
    2
  );
}

// Get measurement value from measurements array
export function getMeasurement(measurements, type) {
  return (
    Number(
      measurements.find((m) => m.measurement_type === type)?.measurement_value
    ) || "-"
  );
}
