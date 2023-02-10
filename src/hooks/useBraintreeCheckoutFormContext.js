import { useContext } from 'react';
import CheckoutFormContext from '@hyva/react-checkout/context/Form/CheckoutFormContext';

export default function useBraintreeCheckoutFormContext() {
  return useContext(CheckoutFormContext);
}
