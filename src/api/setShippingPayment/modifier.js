import fetchGuestCartModifier from '@hyva/react-checkout/api/cart/fetchGuestCart/modifier';

export default function setShippingPaymentModifier(result) {
  return fetchGuestCartModifier(result, 'setPaymentMethodOnCart.cart');
}
