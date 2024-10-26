export default function format_currency(value) {
	return value.toLocaleString("en-US", {
		style: "currency",
		currency: "KES",
	});
}
