import fetchGuestCartModifier from '../../../../../api/cart/fetchGuestCart/modifier';

export default function setPaymentMethodModifier(result) {
  return fetchGuestCartModifier(result, 'setShippingAddressesOnCart.cart');
}
