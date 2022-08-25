import { useCallback } from 'react';
import useBraintreeAppContext from '../../../hooks/useBraintreeAppContext';
import usePerformPlaceOrder from '../../../hooks/usePerformPlaceOrder';
import { validate } from '../utility';

export default function useBraintreeCC(paymentMethodCode) {
  const { setErrorMessage, setPageLoader } = useBraintreeAppContext();
  const performPlaceOrder = usePerformPlaceOrder(paymentMethodCode);

  const handleCreditCardCheckThenPlaceOrder = useCallback(
    async (values) => {
      setPageLoader(true);
      await performPlaceOrder();
      setPageLoader(false);
      return true;
    },
    [setErrorMessage, setPageLoader, performPlaceOrder]
  );

  return {
    handleCreditCardCheckThenPlaceOrder,
  };
}
