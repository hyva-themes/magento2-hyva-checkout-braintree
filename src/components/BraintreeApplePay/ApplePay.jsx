import React from 'react';
import { func, shape } from 'prop-types';
import { paymentMethodShape } from '../../utility';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import Button from './Button';
import { deviceSupported } from './utility';
import paymentConfig from './braintreeApplePayConfig';

function ApplePay({ method, selected, actions }) {
  const isSelected = method.code === selected.code;

  const radioInputTag = (
    <RadioInput
      value={method.code}
      label={method.title}
      name="paymentMethod"
      checked={isSelected}
      onChange={actions.change}
    />
  );

  // Make sure we have a client Token
  if (!paymentConfig.clientToken) {
    return null;
  }

  // If device is not an Apple Device
  if (!deviceSupported()) {
    return null;
  }

  if (isSelected) {
    const buttonTag = <Button method={method} />;
    return [radioInputTag, buttonTag];
  }
  return radioInputTag;
}

ApplePay.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default ApplePay;
