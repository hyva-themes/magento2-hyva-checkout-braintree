import fetchGuestCartModifier from '@hyva/payments/api/cart/fetchGuestCart/modifier';

export default function setPaymentMethodModifier(result) {
  return fetchGuestCartModifier(result, 'setShippingAddressesOnCart.cart');
}
