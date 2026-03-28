export function formatOrderDateTime(
  orderDate?: string,
  orderTime?: string,
  useUTC: boolean = false,
): string {
  if (!orderDate) return "Invalid Date";

  const [dayStr, monthStr, yearStr] = orderDate.split("/");
  if (!dayStr || !monthStr || !yearStr) return "Invalid Date";

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if ([day, month, year].some(isNaN)) return "Invalid Date";

  // Default time
  let hours = 0;
  let minutes = 0;

  if (orderTime) {
    const match = orderTime
      .trim()
      .toLowerCase()
      .match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);

    if (match) {
      hours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);

      const period = match[3];
      if (period === "pm" && hours !== 12) hours += 12;
      if (period === "am" && hours === 12) hours = 0;
    } else {
      // If time is malformed
      return "Invalid Time";
    }
  }

  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

  if (isNaN(utcDate.getTime())) return "Invalid Date";

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: useUTC ? "UTC" : undefined,
  }).format(utcDate);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: useUTC ? "UTC" : undefined,
  }).format(utcDate);

  return `${formattedDate} • ${formattedTime}${useUTC ? " (UTC)" : ""}`;
}
