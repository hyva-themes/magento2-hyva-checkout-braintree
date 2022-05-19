import { CART_DATA_FRAGMENT } from '../../../../../api/cart/utility/query/cartQueryInfo';

export const SET_PAYMENT_METHOD_MUTATION = `
mutation setPaymentMethodMutation(
  $cartId: String!,
  $code: String!,
  $payment_method_nonce: String!,
) {
  setPaymentMethodOnCart(
    input: {
      cart_id: $cartId
      payment_method: {
        code: $code,
        braintree : {
            payment_method_nonce: $payment_method_nonce,
            is_active_payment_token_enabler: false
        }
      }
    }
  ) {
  cart {
    ${CART_DATA_FRAGMENT}
    }
  }
}
`;
