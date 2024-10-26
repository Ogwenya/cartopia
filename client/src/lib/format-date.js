const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

export default function format_date(date) {
  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(new Date(date));
}
