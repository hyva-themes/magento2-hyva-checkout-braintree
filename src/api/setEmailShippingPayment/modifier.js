import fetchGuestCartModifier from '../../../../../api/cart/fetchGuestCart/modifier';

export default function setEmailShippingModifier(result) {
  return fetchGuestCartModifier(result, 'setPaymentMethodOnCart.cart');
}
