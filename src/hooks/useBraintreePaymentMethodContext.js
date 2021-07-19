import { useContext } from 'react';

import { PaymentMethodFormContext } from '../../../../components/paymentMethod/context';

export default function useBraintreePaymentMethodContext() {
  return useContext(PaymentMethodFormContext);
}