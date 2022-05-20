import React from 'react';
import { func, shape } from 'prop-types';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeCreditCardConfig';

import CreditCard from './CreditCard';

function CreditCardWrapper({ method, selected, actions }) {
  if (!paymentConfig.isActive) {
      return null;
  }
  return <CreditCard method={method} selected={selected} actions={actions}/>;
}

CreditCardWrapper.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default CreditCardWrapper;
