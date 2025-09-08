export function formatUtcToLocal(utcString) {
  if (!utcString) return "--";

  // Ensure only one "Z"
  const normalized = utcString.endsWith("Z") ? utcString : utcString + "Z";

  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    console.warn("⚠️ Invalid Date for:", utcString);
    return "Invalid Date";
  }

  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}
