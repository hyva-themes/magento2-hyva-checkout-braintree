import { shape, string } from 'prop-types';
import _get from 'lodash.get';

import { config } from '@hyva/payments/config';
import LocalStorage from '@hyva/payments/utils/localStorage';

export const paymentMethodShape = shape({ title: string, code: string });

export function performRedirect(order) {
  const orderNumber = _get(order, 'order_number');

  if (orderNumber && config.isProductionMode) {
    window.location.replace(`${config.baseUrl}/checkout/onepage/success`);
  }

  if (orderNumber) {
    LocalStorage.clearCheckoutStorage();
  }
}