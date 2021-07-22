import { useContext } from 'react';
import _get from 'lodash.get';

import CartContext from '../../../../context/Cart/CartContext';

export default function useBraintreeCartContext() {
  const [cartData, {setOrderInfo, placeOrder}] = useContext(CartContext);
  const cartId = _get(cartData, 'cart.id');

  return {
    cartId,
    placeOrder,
    setOrderInfo,
  };
}