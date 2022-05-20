import { useContext } from 'react';
import _get from 'lodash.get';

import CartContext from '../../../../context/Cart/CartContext';

export default function useBraintreeCartContext() {
  const [
    cartData,
    {
      setCartInfo,
      setOrderInfo,
      placeOrder,
      addCartShippingAddress,
      setEmailOnGuestCart,
    },
  ] = useContext(CartContext);
  const cartId = _get(cartData, 'cart.id');
  const cart = _get(cartData, 'cart');
  const email = _get(cartData, 'cart.email');
  const billingAddress = _get(cartData, 'cart.billing_address');
  const { grandTotalAmount } = _get(cart, 'prices', {}) || {};

  return {
    cartId,
    email,
    billingAddress,
    grandTotalAmount,
    placeOrder,
    setOrderInfo,
    setCartInfo,
    addCartShippingAddress,
    setEmailOnGuestCart,
  };
}
