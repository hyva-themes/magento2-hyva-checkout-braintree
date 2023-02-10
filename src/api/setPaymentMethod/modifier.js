import fetchGuestCartModifier from '@hyva/react-checkout/api/cart/fetchGuestCart/modifier';

export default function setPaymentMethodModifier(result) {
  return fetchGuestCartModifier(result, 'setShippingAddressesOnCart.cart');
}
