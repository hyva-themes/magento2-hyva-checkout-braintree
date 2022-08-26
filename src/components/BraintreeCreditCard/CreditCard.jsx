import React from 'react';
import { func, shape } from 'prop-types';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeCreditCardConfig';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import Form from './Form';

function CreditCard({ method, selected, actions }) {
  const isSelected = method.code === selected.code;

  if (!paymentConfig.isActive) {
    return null;
  }

  const radioInputTag = (
    <RadioInput
      value={method.code}
      label={method.title}
      name="paymentMethod"
      checked={isSelected}
      onChange={actions.change}
    />
  );

  if (isSelected) {
    const buttonTag = <Form method={method} />;
    return [radioInputTag, buttonTag];
  }
  return radioInputTag;
}

CreditCard.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default CreditCard;
