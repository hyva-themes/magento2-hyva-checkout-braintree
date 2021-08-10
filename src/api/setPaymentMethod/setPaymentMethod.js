import { SET_PAYMENT_METHOD_MUTATION } from './mutation';
import modifier from './modifier';
import sendRequest from '../sendRequest';
import LocalStorage from '@hyva/payments/utils/localStorage';

export default async function setPaymentMethod(paymentMethod, paymentNonce) {
  try {
    const variables = { code: paymentMethod, 
                          cartId: LocalStorage.getCartId(),
                          payment_method_nonce: paymentNonce };
    return modifier(
      await sendRequest({ query: SET_PAYMENT_METHOD_MUTATION, variables })
    );
  }
  catch (error) {
    throw error;
  }
}
