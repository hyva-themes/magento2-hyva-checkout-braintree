import React from 'react';
import { func, shape } from 'prop-types';
import { paymentMethodShape } from '../../utility';

import ApplePay from './ApplePay';
import { deviceSupported } from './utility';

function ApplePayWrapper({ method, selected, actions }) {

  if (!deviceSupported()) {
      return (<></>);
  }

  return (
    <>
      <ApplePay method={method} selected={selected} actions={actions}/>
    </>
  );
}

ApplePayWrapper.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default ApplePayWrapper;