import React from 'react';
import { func, shape } from 'prop-types';
import { paymentMethodShape } from '../../utility';

import ApplePay from './ApplePay';
import { deviceSupported } from './utility';
import paymentConfig from './braintreeApplePayConfig';

function ApplePayWrapper({ method, selected, actions }) {
  // Make sure we have a client Token
  if (!paymentConfig.clientToken) {
    return <></>;
  }

  // If device is not an Apple Device
  if (!deviceSupported()) {
    return <></>;
  }

  return <ApplePay method={method} selected={selected} actions={actions} />;
}

ApplePayWrapper.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default ApplePayWrapper;
