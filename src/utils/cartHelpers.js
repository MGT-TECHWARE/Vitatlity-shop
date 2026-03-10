export function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function findCartItem(items, productId) {
  return items.find((item) => item.id === productId);
}
