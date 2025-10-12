import dayjs from "dayjs";

export const MonthDayYear = (dateString: string) =>
  dayjs(dateString).format("MMM D, YYYY");

// Example:
// MonthDayYear("2025-10-12T14:32:00Z");
// 👉 "Oct 12, 2025"
