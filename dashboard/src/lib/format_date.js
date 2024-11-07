export default function format_date(date, short_month) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: short_month ? "short" : "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(new Date(date));
}
