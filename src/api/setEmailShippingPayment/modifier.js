import fetchGuestCartModifier from '@hyva/react-checkout/api/cart/fetchGuestCart/modifier';

export default function setEmailShippingModifier(result) {
  return fetchGuestCartModifier(result, 'setPaymentMethodOnCart.cart');
}
