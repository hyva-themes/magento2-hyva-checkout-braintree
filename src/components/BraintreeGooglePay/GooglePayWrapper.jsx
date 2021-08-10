import React from 'react';
import { func, shape, bool} from 'prop-types';
import { paymentMethodShape } from '../../utility';
import GooglePay from './GooglePay';
import GooglePayButton from './GooglePayButton';

function GooglePayWrapper({ method, selected, actions, buttonOnly }) {

if (buttonOnly) {
  return (
    <>
      <GooglePayButton/>
    </>
  );
}

return (
    <>
      <GooglePay method={method} selected={selected} actions={actions}/>
    </>
  );
}

GooglePayWrapper.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  buttonOnly: bool
};

export default GooglePayWrapper;