import { useCallback } from 'react';
import { __ } from '@hyva/react-checkout/i18n';
import { performRedirect } from '../utility';
import useBraintreeAppContext from './useBraintreeAppContext';
import useBraintreeCartContext from './useBraintreeCartContext';

export default function usePerformPlaceOrder() {
  const {placeOrder, setOrderInfo } = useBraintreeCartContext();
  const {
    setPageLoader,
    setErrorMessage,
  } = useBraintreeAppContext();

  return useCallback(
    async () => {
      try {
        setPageLoader(true);
        // need to pass in a bypass payment_method so as to call the actiual placeorder function
        const order = await placeOrder({payment_method: { code: 'bypass' }});
        setPageLoader(false);
        performRedirect(order);

        if (order) {
          setOrderInfo(order);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(
          __(
            'This transaction could not be performed. Please select another payment method.'
          )
        );
        setPageLoader(false);
      }
    },
    [
      setOrderInfo,
      setPageLoader,
      setErrorMessage,
      placeOrder,
    ]
  );
}