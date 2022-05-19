import fetchGuestCartModifier from '../../../../api/cart/fetchGuestCart/modifier';

export default function setShippingPaymentModifier(result) {
  return fetchGuestCartModifier(result, 'setPaymentMethodOnCart.cart');
}
