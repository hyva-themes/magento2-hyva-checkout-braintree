import { SET_PAYMENT_METHOD_MUTATION } from './mutation';
import modifier from './modifier';
import sendRequest from '../../../../../../../api/sendRequest';
import LocalStorage from '../../../../../../../utils/localStorage';

export default async function setPaymentMethod(paymentMethod, paymentNonce) {
  const variables = { code: paymentMethod, 
                        cartId: LocalStorage.getCartId(),
                        payment_method_nonce: paymentNonce };

  return modifier(
    await sendRequest({ query: SET_PAYMENT_METHOD_MUTATION, variables })
  );
}
