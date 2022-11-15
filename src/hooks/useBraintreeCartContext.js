import { useContext } from 'react';
import { get as _get } from 'lodash-es';
import { _isObjEmpty } from '../../../../utils';
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
  const { shipping_methods: methodList } = _get(cartData, 'cart', {});

  return {
    cartId,
    email,
    billingAddress,
    grandTotalAmount,
    methodsAvailable: !_isObjEmpty(methodList),
    placeOrder,
    setOrderInfo,
    setCartInfo,
    addCartShippingAddress,
    setEmailOnGuestCart,
  };
}
