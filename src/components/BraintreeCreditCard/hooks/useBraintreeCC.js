import { useCallback } from 'react';

import useBraintreeAppContext from '../../../hooks/useBraintreeAppContext';
import usePerformPlaceOrder from '../../../hooks/usePerformPlaceOrder';
import { validate } from '../utility';

export default function useBraintreeCC(paymentMethodCode) {
  const { setErrorMessage, setPageLoader } = useBraintreeAppContext();
  const performPlaceOrder = usePerformPlaceOrder(paymentMethodCode);

  const handleCreditCardCheckThenPlaceOrder = useCallback(
    async (values) => {

      console.log(values);
      const { isValid, message } = validate(values) ;

      if (!isValid) {
        setErrorMessage(message);
        setPageLoader(false);
        return false;
      }
      await performPlaceOrder();
      return true;
    },
    [setErrorMessage, setPageLoader, performPlaceOrder]
  );

  return {
    handleCreditCardCheckThenPlaceOrder,
  };
}