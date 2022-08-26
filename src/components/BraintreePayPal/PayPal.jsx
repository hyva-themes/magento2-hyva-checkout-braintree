import React from 'react';
import { func, shape } from 'prop-types';
import { paymentMethodShape } from '../../utility';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import paymentConfig from './braintreePayPalConfig';
import Form from './Form';

function PayPal({ method, selected, actions }) {
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

  if (!paymentConfig.isActive) {
    return null;
  }
  if (isSelected && googlePayLoaded) {
    const buttonTag = <Form method={method}/>;
    return [radioInputTag, buttonTag];
  }
  return radioInputTag;
}

PayPal.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default PayPal;
