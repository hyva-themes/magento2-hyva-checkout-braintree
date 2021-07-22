import React from 'react';
import { string } from 'prop-types';

import CCIframe from './CCIframe';
function CCForm({ detectedCardType }) {

  return (
    <div className="w-full">
      <CCIframe detectedCardType={detectedCardType} />
    </div>
  );
}

CCForm.propTypes = {
  detectedCardType: string.isRequired,
};

export default CCForm;