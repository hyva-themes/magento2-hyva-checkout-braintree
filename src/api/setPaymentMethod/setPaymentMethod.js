import LocalStorage from '@hyva/react-checkout/utils/localStorage';
import sendRequest from '@hyva/react-checkout/api/sendRequest';
import { SET_PAYMENT_METHOD_MUTATION } from './mutation';
import modifier from './modifier';

export default async function setPaymentMethod(
  dispatch,
  paymentMethod,
  paymentNonce
) {
  const variables = {
    code: paymentMethod,
    cartId: LocalStorage.getCartId(),
    payment_method_nonce: paymentNonce,
  };
  return modifier(
    await sendRequest(dispatch, {
      query: SET_PAYMENT_METHOD_MUTATION,
      variables,
    })
  );
}
