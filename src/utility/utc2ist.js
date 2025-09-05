export function formatUtcToLocal(utcString) {
  return new Date(utcString + "Z").toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata", // force IST
  });
}
