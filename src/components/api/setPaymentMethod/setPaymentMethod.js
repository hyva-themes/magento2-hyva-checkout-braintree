import { SET_PAYMENT_METHOD_MUTATION } from './mutation';
import modifier from './modifier';
import sendRequest from '@hyva/react-checkout/../../api/sendRequest';
import LocalStorage from '@hyva/react-checkout/../../utils/localStorage';

export default async function setPaymentMethod(paymentMethod, paymentNonce) {
  const variables = { code: paymentMethod, 
                        cartId: LocalStorage.getCartId(),
                        payment_method_nonce: paymentNonce };

  return modifier(
    await sendRequest({ query: SET_PAYMENT_METHOD_MUTATION, variables })
  );
}
