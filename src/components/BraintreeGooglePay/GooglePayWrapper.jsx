import React from 'react';
import { func, shape, bool } from 'prop-types';
import { paymentMethodShape } from '../../utility';
import GooglePay from './GooglePay';
import GooglePayButton from './GooglePayButton';
import paymentConfig from './braintreeGooglePayConfig';

function GooglePayWrapper({ method, selected, actions, buttonOnly = false }) {
  // Make sure we have a client Token
  if (!paymentConfig.clientToken) {
    return null;
  }

  // GooglePay and GooglePayButton are very similar but there was 
  // enough of a difference to seperate them out 
  if (buttonOnly) {
    return (<GooglePayButton/>);
  }

  return (<GooglePay method={method} selected={selected} actions={actions} />);
}

GooglePayWrapper.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  buttonOnly: bool
};

export default GooglePayWrapper;
