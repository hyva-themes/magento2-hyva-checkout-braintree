import React from 'react';
import { string } from 'prop-types';

import CCIframe from './CCIframe';
import { cardForm } from '../../utility/braintreeConfig';

function CCForm({ detectedCardType }) {

  let newCardForm = Object.assign(cardForm['base'],cardForm[detectedCardType]);

  return (
    <div className="w-full" style={newCardForm}>
      <CCIframe detectedCardType={detectedCardType} />
    </div>
  );
}

CCForm.propTypes = {
  detectedCardType: string.isRequired,
};

export default CCForm;