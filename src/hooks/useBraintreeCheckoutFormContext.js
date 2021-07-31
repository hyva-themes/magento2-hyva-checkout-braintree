import { useContext } from 'react';
import CheckoutFormContext from '@hyva/payments/context/Form/CheckoutFormContext';

export default function useBraintreeCheckoutFormContext() {
  return useContext(CheckoutFormContext);
}