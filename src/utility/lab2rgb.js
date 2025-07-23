// Converts LAB to XYZ then to RGB
export function lab2rgb(L, A, B) {
  // Reference white point
  const REF_X = 95.047;
  const REF_Y = 100.0;
  const REF_Z = 108.883;

  // Step 1: Convert LAB to XYZ
  let y = (L + 16) / 116;
  let x = A / 500 + y;
  let z = y - B / 200;

  const pow3 = (v) => Math.pow(v, 3);
  const cubeRoot = (v) => Math.cbrt(v);
  const delta = 6 / 29;

  x = REF_X * (pow3(x) > 0.008856 ? pow3(x) : (x - 16 / 116) / 7.787);
  y = REF_Y * (pow3(y) > 0.008856 ? pow3(y) : (y - 16 / 116) / 7.787);
  z = REF_Z * (pow3(z) > 0.008856 ? pow3(z) : (z - 16 / 116) / 7.787);

  // Step 2: Convert XYZ to RGB
  x /= 100;
  y /= 100;
  z /= 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  // Compand and clamp
  const compand = (c) => {
    c = c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
    return Math.min(255, Math.max(0, Math.round(c * 255)));
  };

  return {
    r: compand(r),
    g: compand(g),
    b: compand(b),
  };
}
