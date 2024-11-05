export default function calculate_discount(product) {
  let discount_amount = 0;

  if (product.discount_type === "NONE") {
    discount_amount = 0;
  } else if (product.discount_type === "Amount") {
    discount_amount = product.discount_value || product.discount;
  } else {
    discount_amount =
      (product.discount_value / 100 || product.discount / 100) * product.price;
  }
  const after_discount_price = product.price - discount_amount;

  return { discount_amount, after_discount_price };
}
