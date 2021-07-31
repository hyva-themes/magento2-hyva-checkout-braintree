import { useContext } from 'react';

import AppContext from '@hyva/react-checkout/context/App/AppContext';

export default function useBraintreeAppContext() {
  const [
    { isLoggedIn, stateList, countryList },
    { setErrorMessage, setPageLoader },
  ] = useContext(AppContext);

  return {
    isLoggedIn,
    stateList,
    countryList,
    setErrorMessage,
    setPageLoader,
  };
}