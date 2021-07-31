import _get from 'lodash.get';

import { __ } from '@hyva/payments/i18n';
import { _isArrayEmpty } from '@hyva/payments/utils';
import fetchGuestCartModifier from '@hyva/payments/api/cart/fetchGuestCart/modifier';

export default function setPaymentMethodModifier(result) {
  const errors = _get(result, 'errors');

  if (errors && !_isArrayEmpty(errors)) {
    const message = _get(errors, 'message');
    if (message) {
      throw new Error(message);
    }
    else {
      throw new Error(__('Saving payment method failed.'));
    }
  }

  return fetchGuestCartModifier(result, 'setPaymentMethodOnCart.cart');
}
