import React from 'react';
import { func, shape } from 'prop-types';
import RadioInput from '@hyva/react-checkout/components/common/Form/RadioInput';
import { paymentMethodShape } from '../../utility';
import paymentConfig from './braintreeCreditCardConfig';
import Form from './Form';
import useBraintreeCartContext from '../../hooks/useBraintreeCartContext';

function CreditCard({ method, selected, actions }) {
  const isSelected = method.code === selected.code;
  const { methodsAvailable } = useBraintreeCartContext();

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

  if (!methodsAvailable) {
    const infoTag = <p>Please Select a Shipping Address</p>;
    return [radioInputTag, infoTag];
  }

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
