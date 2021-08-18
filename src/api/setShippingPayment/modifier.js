import fetchGuestCartModifier from '@hyva/payments/api/cart/fetchGuestCart/modifier';

export default function setShippingPaymentModifier(result) {
  return fetchGuestCartModifier(result, 'setPaymentMethodOnCart.cart');
}
