import fetchGuestCartModifier from '@hyva/payments/api/cart/fetchGuestCart/modifier';

export default function setEmailShippingModifier(result) {
  return fetchGuestCartModifier(result, 'setShippingAddressesOnCart.cart');
}
