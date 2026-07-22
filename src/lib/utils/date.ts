export function formatOrderDateTime(
  orderDate?: string,
  orderTime?: string,
  useUTC: boolean = false,
): string {
  if (!orderDate) return "Invalid Date";

  const [dayStr, monthStr, yearStr] = orderDate.split("/");
  if (!dayStr || !monthStr || !yearStr) return "Invalid Date";

  let day = Number(dayStr);
  let month = Number(monthStr);
  const year = Number(yearStr);

  if ([day, month, year].some(isNaN)) return "Invalid Date";

  // This is meant to be "D/M/Y", but some endpoints send unpadded US-style
  // "M/D/Y" instead (e.g. "7/22/2026" for Jul 22). A real month is never
  // >12, so if that's what we got here but the day slot is a valid month,
  // the two are swapped — correcting it here avoids the date rolling into
  // the wrong month/year (e.g. "7/22/2026" misread as month=22 -> Oct 2027).
  if (month > 12 && day <= 12) {
    [day, month] = [month, day];
  }

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

// Same output format as formatOrderDateTime, but parsed straight from an
// unambiguous ISO timestamp instead of a locale-dependent "D/M/Y" string.
export function formatOrderDateTimeFromISO(
  iso?: string,
  useUTC: boolean = false,
): string {
  if (!iso) return "Invalid Date";

  const date = new Date(iso);
  if (isNaN(date.getTime())) return "Invalid Date";

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: useUTC ? "UTC" : undefined,
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: useUTC ? "UTC" : undefined,
  }).format(date);

  return `${formattedDate} • ${formattedTime}${useUTC ? " (UTC)" : ""}`;
}
