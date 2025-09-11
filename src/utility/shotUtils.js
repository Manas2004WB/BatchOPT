// Utility functions for ShotsPage and ShotRow

// Calculate delta E (Euclidean distance)
export function calcDeltaE(l, a, b, randomL, randomA, randomB) {
  const L1 = Number(l);
  const A1 = Number(a);
  const B1 = Number(b);
  const L2 = Number(randomL);
  const A2 = Number(randomA);
  const B2 = Number(randomB);

  const deltaL = L2 - L1;
  const deltaA = A2 - A1;
  const deltaB = B2 - B1;

  return Math.sqrt(deltaL ** 2 + deltaA ** 2 + deltaB ** 2).toFixed(2);
}

// Get measurement value from measurements array
export function getMeasurement(measurements, type) {
  return (
    Number(
      measurements.find((m) => m.measurement_type === type)?.measurement_value
    ) || "-"
  );
}
