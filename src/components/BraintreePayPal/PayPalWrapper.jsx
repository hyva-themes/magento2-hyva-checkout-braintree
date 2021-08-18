import React from 'react';
import { func, shape } from 'prop-types';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreePayPalConfig';

import PayPal from './PayPal';

function PayPalWrapper({ method, selected, actions }) {

  if (!paymentConfig.isActive) {
      return (<></>);
  }

  return (
    <>
      <PayPal method={method} selected={selected} actions={actions}/>
    </>
  );
}

PayPalWrapper.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default PayPalWrapper;