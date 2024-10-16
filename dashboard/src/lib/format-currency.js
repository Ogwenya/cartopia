export default function format_currency(amount) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "KES",
	}).format(amount);
}
