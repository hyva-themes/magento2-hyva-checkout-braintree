import React, { useState, useEffect } from 'react';
import { func, shape } from 'prop-types';
import { paymentMethodShape } from '../../utility';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import Button from './Button';
import paymentConfig from './braintreeGooglePayConfig';

function GooglePay({ method, selected, actions }) {
  const [googlePayLoaded, setGogglePayLoaded] = useState(false);
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

  // add the gpay script in
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;
    script.onload = () => {
      setGogglePayLoaded(true);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Make sure we have a client Token
  if (!paymentConfig.clientToken) {
    return null;
  }

  if (isSelected && googlePayLoaded) {
    const buttonTag = <Button method={method} />;
    return [radioInputTag, buttonTag];
  }
  return radioInputTag;
}

GooglePay.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default GooglePay;
